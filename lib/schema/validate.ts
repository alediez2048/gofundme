/**
 * FR-059: Build-time schema validation.
 * Validates JSON-LD objects against schema.org requirements.
 */

interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

const REQUIRED_BY_TYPE: Record<string, string[]> = {
  DonateAction: ["@context", "@type", "name", "target"],
  Organization: ["@context", "@type", "name"],
  Person: ["@context", "@type", "name"],
  BreadcrumbList: ["@context", "@type", "itemListElement"],
  FAQPage: ["@context", "@type", "mainEntity"],
  ItemList: ["@context", "@type", "itemListElement"],
  WebSite: ["@context", "@type", "name", "url"],
};

export function validateSchema(data: Record<string, unknown>): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  const type = data["@type"] as string | undefined;
  if (!type) {
    errors.push("Missing @type");
    return { valid: false, errors, warnings };
  }

  if (!data["@context"]) {
    errors.push("Missing @context");
  }

  const required = REQUIRED_BY_TYPE[type];
  if (required) {
    for (const field of required) {
      if (!(field in data)) {
        errors.push(`${type}: missing required field "${field}"`);
      }
    }
  }

  // Warnings for AEO best practices
  if (!data["dateModified"] && ["DonateAction", "Person", "Organization"].includes(type)) {
    warnings.push(`${type}: missing dateModified (Perplexity weighs ~40%)`);
  }
  if (!data["@id"] && ["DonateAction", "Person", "Organization"].includes(type)) {
    warnings.push(`${type}: missing @id (only 4% of sites use cross-referencing)`);
  }
  if (type === "Person" && !data["sameAs"]) {
    warnings.push("Person: missing sameAs for entity linking");
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/** Validate an array of schemas, returning combined results. */
export function validateSchemas(schemas: Record<string, unknown>[]): ValidationResult {
  const combined: ValidationResult = { valid: true, errors: [], warnings: [] };

  for (const schema of schemas) {
    const result = validateSchema(schema);
    if (!result.valid) combined.valid = false;
    combined.errors.push(...result.errors);
    combined.warnings.push(...result.warnings);
  }

  return combined;
}
