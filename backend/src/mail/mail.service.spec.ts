import { Test, TestingModule } from '@nestjs/testing';
import { MailService } from './mail.service';
import { ConfigService } from '@nestjs/config';
import { MAIL_PROVIDER } from './mail.constants';
import * as compileMjml from './helpers/compile-mjml';
import * as renderHbs from './helpers/render-hbs';

jest.mock('./helpers/compile-mjml');
jest.mock('./helpers/render-hbs');

describe('MailService', () => {
  let service: MailService;

  const mockMailProvider = {
    send: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn().mockReturnValue('http://localhost:3000'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MailService,
        { provide: MAIL_PROVIDER, useValue: mockMailProvider },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<MailService>(MailService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sendTemplate', () => {
    it('should compile MJML and render Handlebars before sending', async () => {
      const compileSpy = jest
        .spyOn(compileMjml, 'compileMJML')
        .mockReturnValue('MJML content');
      const renderSpy = jest
        .spyOn(renderHbs, 'renderTemplate')
        .mockReturnValue('HTML content');

      await service.sendTemplate(
        'test@example.com',
        'Test Subject',
        'template-id',
        { name: 'Test' },
      );

      expect(compileSpy).toHaveBeenCalledWith('template-id', 'base');
      expect(renderSpy).toHaveBeenCalled();
      expect(mockMailProvider.send).toHaveBeenCalledWith({
        to: 'test@example.com',
        subject: 'Test Subject',
        html: 'HTML content',
      });
    });
  });
});
