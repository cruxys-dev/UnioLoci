import * as fs from 'fs';
import mjml2html from 'mjml';
import * as path from 'path';

/**
 * Loads a template and a layout, and combines them.
 * The layout must contain {{{ body }}} where the template will be injected.
 *
 * @param templateName Name of the template (without .mjml)
 * @param layoutName Name of the layout (without .mjml), defaults to 'base'
 * @returns The combined MJML string
 */
export const compileMJML = (
  templateName: string,
  layoutName: string | false = 'base',
): string => {
  const templatesDir = path.join(__dirname, '../templates');

  const templatePath = path.join(templatesDir, `${templateName}.mjml`);

  if (!fs.existsSync(templatePath)) {
    throw new Error(`Template not found: ${templatePath}`);
  }

  const template = fs.readFileSync(templatePath, 'utf8');

  if (layoutName === false) return toHtml(template);

  const layoutPath = path.join(templatesDir, `${layoutName}.mjml`);

  if (!fs.existsSync(layoutPath)) {
    throw new Error(`Layout not found: ${layoutPath}`);
  }

  const layout = fs.readFileSync(layoutPath, 'utf8');

  // Inject template into layout
  return toHtml(layout.replace('{{{ body }}}', template));
};

const toHtml = (mjml: string): string => {
  const { html, errors } = mjml2html(mjml);

  if (errors.length > 0) {
    throw new Error('MJML to HTML conversion failed', { cause: errors });
  }

  return html;
};
