import { TestBed } from '@angular/core/testing';
import { DomSanitizer } from '@angular/platform-browser';
import { SafeHtmlPipe } from './safe-html.pipe';

describe('SafeHtmlPipe', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({ providers: [DomSanitizer, SafeHtmlPipe] });
    });

    it('create an instance', () => {
        const pipe = TestBed.inject(SafeHtmlPipe);
        expect(pipe).toBeTruthy();
    });
});
