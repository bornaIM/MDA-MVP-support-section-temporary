
import { isObject, reduce, merge, uniq, flatten, omit, isEqual, get, memoize, isArray } from "lodash";
import { UIState } from "../types";
import { COLLECTED_DATA_DEPENDENCIES, observedPaths } from "./sticky-old-state.config";

/*
    returns array of all properties which are affected by `changedPath` change
    based on dependencies config above
    e.g. if there is a change to product generation, we have to invalidate tsg answers
*/
const getAllDependentPaths = memoize((changedPath: string) => {
    const visited = new Set();
    const result = [changedPath];
    let currIndex = 0;
    while (currIndex < result.length) {
        let currPath = result[currIndex];
        visited.add(currPath);
        for (const path in COLLECTED_DATA_DEPENDENCIES) {
            if (!visited.has(path) && COLLECTED_DATA_DEPENDENCIES[path].includes(currPath)) {
                result.push(path);
            }
        }
        currIndex++;
    }
    return result;
});

// https://github.com/lodash/lodash/issues/2240#issuecomment-418820848
const flattenKeys = (obj: Object, path: string[] = []): Object => {
   if (isObject(obj) && (Object.keys(obj).length === 0)) return {
        [path.join('.')]: isArray(obj) ? '[]': '{}'
    };

    return !isObject(obj)
        ? { [path.join('.')]: obj }
        : reduce(obj, (cum, next, key) => merge(cum, flattenKeys(next, [...path, key])), {});
}

/*
    returns all paths which are no longer valid in newState after `updates` are applied to oldState
    for example, if `collectedData.issueCategory` was updated, we can't reuse the old 
    `collectedData.tsgInterview` answers
*/
function getPathsToOmit(oldState: UIState, updates: Partial<UIState>) {
    // all the paths which are to be updated with this change
    const pathsInUpdates = Object.keys(flattenKeys(updates));
    // all the paths we care about, and which are part of updates object
    const observedPathsInUpdates = uniq(observedPaths.filter(
        oP => pathsInUpdates.some(uP => uP.startsWith(oP)
    )));
    // path might be present in the updates object, but the actual value is the same as old value
    const updatedObservedPaths = observedPathsInUpdates.filter(
        path => !isEqual(
            get(oldState, path),
            get(updates, path)
        )
    );
    // now, collect all paths which are affected by updates we care about
    // based on our dependencies configuration
    const pathsToOmit = uniq(flatten(updatedObservedPaths.map(getAllDependentPaths)));
    return pathsToOmit;
}

/*
    new state is old state with updates applied
    and only those values from oldState which are
    not affected by updates based on dependencies config
*/
export function withStickyOldState(oldState: UIState, updates: Partial<UIState>) {
    // we use _.merge instead of object destructuring to
    // preserve nested values in a generalized way (independent of UIState schema)
    return merge(
        omit(oldState, getPathsToOmit(oldState,updates)),
        updates
    ) as UIState
}