import { Component, Input, OnInit } from '@angular/core';

type IssueType = 'oops' | 'smth-wrong' | 'huston' | 'need-action';

@Component({
    selector: 'app-issue-display',
    templateUrl: './issue-display.component.html',
    styleUrls: ['./issue-display.component.scss'],
})
export class IssueDisplayComponent implements OnInit {
    @Input()
    type?: IssueType;
    issueTitle?: string;

    ngOnInit(): void {
        switch (this.type) {
            case 'oops':
                this.issueTitle = 'Oooops...';
                break;
            case 'need-action':
                this.issueTitle = 'Action needed';
                break;
            case 'smth-wrong':
                this.issueTitle = 'Something went wrong...';
                break;
            case 'huston':
                this.issueTitle = 'Houston, we have a problem...';
                break;
            default:
                this.issueTitle = '';
                break;
        }
    }
}
