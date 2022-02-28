import { Component, Input, OnInit } from '@angular/core';
import { faEdit, faPencilAlt, faStar, faTrash, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { Comment } from 'data/comments/comment';
import { Utilities } from 'data/utilities';

@Component({
  selector: '[single-comment]',
  templateUrl: './single-comment.component.html',
  styleUrls: ['./single-comment.component.scss']
})
export class SingleCommentComponent implements OnInit {

  @Input()
  comment: Comment;

  @Input()
  isMyComment: boolean;

  faStar: IconDefinition = faStar;
  faEdit: IconDefinition = faPencilAlt;
  faTrash: IconDefinition = faTrash;

  constructor() { }

  ngOnInit(): void {    
  }

  getDateForComment(): string {
    return Utilities.printDate(this.comment.dateCreated);
  }

}
