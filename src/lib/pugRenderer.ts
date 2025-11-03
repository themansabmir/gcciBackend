import pug from 'pug';
import path from 'path';

export const renderTemplate = (templateName: string, data: Record<string, any>) => {
  const templatePath = path.join(__dirname, '..', 'templates', `${templateName}.pug`);
  return pug.renderFile(templatePath, data);
};
