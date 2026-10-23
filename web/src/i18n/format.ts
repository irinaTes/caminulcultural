/** Fills `{name}` placeholders in a dictionary string. */
export function fill(
  template: string,
  values: Record<string, string | number>,
) {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    String(values[key] ?? match),
  );
}

type PluralForms = Partial<Record<Intl.LDMLPluralRule, string>> & {
  other: string;
};

/** Picks the plural form for `count` and fills `{n}`: "1 loc", "3 locuri", "20 de locuri". */
export function plural(forms: PluralForms, count: number, intlLocale: string) {
  const rule = new Intl.PluralRules(intlLocale).select(count);
  return fill(forms[rule] ?? forms.other, { n: count });
}
