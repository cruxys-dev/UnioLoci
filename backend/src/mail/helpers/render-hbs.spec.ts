import { renderTemplate } from './render-hbs';

describe('render-hbs helper', () => {
  it('should interpolate variables correctly', () => {
    const template = 'Hello {{ name }}!';
    const context = { name: 'World' };
    expect(renderTemplate(template, context)).toBe('Hello World!');
  });

  it('should handle missing variables by rendering nothing', () => {
    const template = 'Hello {{ name }}!';
    expect(renderTemplate(template, {})).toBe('Hello !');
  });

  it('should handle complex objects', () => {
    const template = 'User: {{ user.name }} ({{ user.role }})';
    const context = { user: { name: 'Alice', role: 'Admin' } };
    expect(renderTemplate(template, context)).toBe('User: Alice (Admin)');
  });
});
