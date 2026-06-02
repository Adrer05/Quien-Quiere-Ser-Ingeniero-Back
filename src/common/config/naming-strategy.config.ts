import { DefaultNamingStrategy, NamingStrategyInterface } from 'typeorm';

// Implementación limpia y nativa de snake_case sin dependencias externas
function toSnakeCase(str: string): string {
  if (!str) return str;
  return str
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1_$2')
    .toLowerCase();
}

export class SnakeNamingStrategy extends DefaultNamingStrategy implements NamingStrategyInterface {
  
  tableName(className: string, customName: string): string {
    return customName ? customName : toSnakeCase(className);
  }

  columnName(propertyName: string, customName: string, embeddedPrefixes: string[]): string {
    return (
      toSnakeCase(embeddedPrefixes.concat('').join('_')) +
      (customName ? customName : toSnakeCase(propertyName))
    );
  }

  relationName(propertyName: string): string {
    return toSnakeCase(propertyName);
  }

  joinColumnName(relationName: string, referencedColumnName: string): string {
    return toSnakeCase(relationName + '_' + referencedColumnName);
  }

  joinTableName(
    firstTableName: string,
    secondTableName: string,
    firstPropertyName: string,
    secondPropertyName: string,
  ): string {
    return toSnakeCase(
      firstTableName +
        '_' +
        firstPropertyName +
        '_' +
        secondTableName +
        '_' +
        secondPropertyName,
    );
  }

  joinTableColumnName(tableName: string, propertyName: string, columnName?: string): string {
    return toSnakeCase(tableName + '_' + (columnName ? columnName : propertyName));
  }

  classTableInheritanceParentColumnName(
    parentTableName: any,
    parentTableIdPropertyName: any,
  ): string {
    return toSnakeCase(parentTableName + '_' + parentTableIdPropertyName);
  }

  eagerJoinRelationAlias(alias: string, propertyPath: string): string {
    return alias + '__' + propertyPath.replace('.', '_');
  }
}