import type { JSONSchema7 } from 'json-schema';
import type { Config } from 'json-schema-yup-transformer';

import type {
    UseValidationParams,
    ValidationMeta as FrameworkValidationMeta,
} from '@dexcomit/web-vendor-framework/utils';

export type SchemaDefinitionModifications = {
    omit: string[]
};

export type ValidationParams = {
    schemaName?: string;
    config?: Config;
    definitionsSchemaName?: string;
    modifications?: SchemaDefinitionModifications;
};

export interface ValidationMeta extends FrameworkValidationMeta {
    schema?: JSONSchema7;
}

export type UseValidationType = (params: UseValidationParams<ValidationParams>) => ValidationMeta