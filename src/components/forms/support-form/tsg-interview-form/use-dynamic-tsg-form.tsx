import { useState, useEffect } from 'react';
import { SalesforceApiTemplate, TsgFormSubmitData } from './types';

let questionCodeAnswerMap: Map<string, string | string[]> = new Map();

const checkConstraint = (questionConstraints: string | null): boolean => {
    // 1.) check if constraint even exists
    let constraintMet = questionConstraints === null;

    // 2.) if constraint exists, check if it`s satisfied
    if (!constraintMet) {
        constraintMet = questionConstraints!.split(';').some((constraint) => {
            const constraintArray = constraint.split('-');
            const previousAnswer = questionCodeAnswerMap.get(
                constraintArray[0]
            );

            if (Array.isArray(previousAnswer)) {
                // true for questions with multiple answers, for example checkbox groups
                return previousAnswer.includes(constraintArray[1]);
            } else {
                // here value is always one single string
                return previousAnswer === constraintArray[1];
            }
        });
    }

    return constraintMet;
};

const checkQuestionConstraints = (tsgQuestion: SalesforceApiTemplate) => {
    const parentConstaintMet = checkConstraint(tsgQuestion.parentConstraint);
    const questionConstaintMet = checkConstraint(
        tsgQuestion.questionConstraint
    );

    // parentConstaint and questionConstaint are connected with && logic operator
    // 'Display' questions are always ignored
    return (
        parentConstaintMet && questionConstaintMet && tsgQuestion.questionRef.questionType !== 'Display'
    );
};

const findNewQuestionSubcollection = (
    fetchedTSGQuestions: SalesforceApiTemplate[],
    questionId: string,
    questionCode: string,
    questionAnswer: string | string[]
) => {
    // 1) update the constraint map (either update or delete value)
    if (questionAnswer) {
        questionCodeAnswerMap.set(questionCode, questionAnswer);
    } else if (
        questionAnswer === '' &&
        questionCodeAnswerMap.get(questionCode)
    ) {
        questionCodeAnswerMap.delete(questionCode);
    }

    // 2) Go through all questions and see which questions are valid and which are not
    const questionsToRender: SalesforceApiTemplate[] = [];

    fetchedTSGQuestions.forEach((tsgQuestion) => {
        const questionShouldBeRendered = checkQuestionConstraints(tsgQuestion);
        if (questionShouldBeRendered) {
            questionsToRender.push(tsgQuestion);

            // check if this question was answered before, if yes, update it`s user selected (initial during rerender value)
            if (tsgQuestion.questionId === questionId) {
                tsgQuestion.userEnteredAnswer = questionAnswer;
            }
        } else {
            tsgQuestion.userEnteredAnswer = undefined;
            questionCodeAnswerMap.delete(tsgQuestion.questionCode!);
        }
    });

    return questionsToRender;
};

export const useDynamicTSGForm = (
    initialQuestions: SalesforceApiTemplate[],
    initialValues?: TsgFormSubmitData
) => {
    const [questionsToRender, setQuestionsToRender] = useState<
        SalesforceApiTemplate[]
    >([]);

    const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>(
        {}
    );

    useEffect(() => {
        const templateAnswerMap: Map<string, string | string[]> = new Map();
        const touchedFields: Record<string, boolean> = {};

        if (initialValues) {
            // reset questionCodeAnswerMap
            questionCodeAnswerMap.clear();

            initialValues?.forEach((initialValue) => {
                questionCodeAnswerMap.set(
                    initialValue.salesforceApiTemplate.questionCode,
                    initialValue.response
                );

                templateAnswerMap.set(
                    initialValue.salesforceApiTemplate.templateId,
                    initialValue.response
                );

                touchedFields[initialValue.salesforceApiTemplate.questionId] =
                    true;
            });

            setTouchedFields(touchedFields);
        }

        const questionsToKeep: SalesforceApiTemplate[] = [];

        initialQuestions.forEach((question: SalesforceApiTemplate) => {
            const oldAnswer = templateAnswerMap.get(question.templateId);
            if (oldAnswer) {
                question.userEnteredAnswer = oldAnswer;
            }
            if (checkQuestionConstraints(question)) {
                questionsToKeep.push(question);
            }
        });

        setQuestionsToRender(questionsToKeep);
    }, [initialValues, initialQuestions]);

    const addNewAnswerToDynamicForm = (
        questionId: string,
        questionCode: string,
        questionAnswer: string | string[]
    ) => {
        const result = findNewQuestionSubcollection(
            initialQuestions,
            questionId,
            questionCode,
            questionAnswer
        );

        setQuestionsToRender(result);

        const newTouched = { ...touchedFields };
        newTouched[questionId] = true;
        setTouchedFields(newTouched);
    };

    return {
        questionsToRender,
        touchedFields,
        addNewAnswerToDynamicForm,
    };
};
