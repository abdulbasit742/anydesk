export function canPublishHelpArticle(input: { title: string; body: string }): string[] {
  const errors: string[] = [];
  if (input.title.trim().length < 3) errors.push("title-too-short");
  if (input.body.trim().length < 20) errors.push("body-too-short");
  if (/<script/i.test(input.body)) errors.push("script-tag-blocked");
  return errors;
}
