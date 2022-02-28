import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { faBookmark, faChevronRight, faComment, faCommenting, faComments, faCommentSlash, faEye, faFlag, faFlagCheckered, faHomeUser, faStar, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { Book } from 'data/book/book';
import { BookDataManipulation } from 'data/book/book-data-manipulation';
import { Comment, Comments } from 'data/comments/comment';
import { PathResolver } from 'data/path-resolver';
import { RecommendBookService } from 'src/app/shared/services/modals/recommend-book-service';
import { TitleService } from 'src/app/shared/services/title-service';
import { FindBookResolver } from './find-book-resolver';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.scss']
})
export class BookComponent implements OnInit {

  faHome: IconDefinition = faHomeUser;
  faChevronRight: IconDefinition = faChevronRight;
  faStar: IconDefinition = faStar;
  faComments: IconDefinition = faCommenting;
  faBookmark: IconDefinition = faBookmark;
  faEye: IconDefinition = faEye;
  faFlag: IconDefinition = faFlag;
  faComment: IconDefinition = faComment;
  faCommentSlash: IconDefinition = faCommentSlash;

  book: Book;  
  numberOfComments: number;
  isPresentMyComment: boolean;
  myComment: Comment;
  comments: Comments;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private titleService: TitleService,
    private findBookResolver: FindBookResolver,
    private recommendService: RecommendBookService
  ) {     
  }

  ngOnInit(): void {
    this.route.params.subscribe((param) => {
      let slug: string = param['slug'];
      this.book = BookDataManipulation.getBookBySlug(slug)!;
      if ( this.book === null )
        this.router.navigate([PathResolver.getPathForAllBooks()]);
    });
    this.titleService.changeTitle(this.book.title);   
    this.numberOfComments = this.findBookResolver.comments.length;   
    this.isPresentMyComment = this.findBookResolver.userHasComment; 
    this.myComment = this.findBookResolver.userComment; 
    this.comments = this.findBookResolver.comments;
  }

  getLinkForAllBooks(): string {
    return PathResolver.getPathForAllBooks();
  }

  getMainPrice(): string {
    let s: string = "";
    let p: number;    

    p = Math.floor(this.book.price);
    s += p.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&.');
    s = s.replace(/\.\d{2}$/g, '');

    return s;
  }

  getPennies(): string {
    let p: number = Math.floor(this.book.price);
    let p1: number = (this.book.price - p) * 100;
    p1 = Math.floor(p1);
    let s: string;
    if ( p1 < 10 ) {
      s = "0" + p1;      
    } else {
      s = String(p1);
    } 
    return s;
  }

  getImageForBook(): string {
    return PathResolver.BOOK_PICTURE_DIRECTORY + this.book.image;
  }

  onRecommend(): void {
    this.recommendService.openModal(this.book);
  }

}
