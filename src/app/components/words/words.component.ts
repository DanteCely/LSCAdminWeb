import { Component, OnInit } from '@angular/core';
import { WordsService } from '../../services/words.service';
import { Word } from '../../word';
import { NewWord } from '../../new-word';

@Component({
  selector: 'app-words',
  templateUrl: './words.component.html',
  styleUrls: ['./words.component.css']
})
export class WordsComponent implements OnInit {
  words: Word[];

  selectedVideo: File = null;
  nameVideo: string = null;
  constructor(private wordService: WordsService) { }

  ngOnInit() {
  }

  onFileVideo(event) {
    // console.log(event.target.files[0]);
    if ( event.target.files[0] ) {
      this.selectedVideo = <File>event.target.files[0];
      this.nameVideo = event.target.files[0].name;
    } else {
      this.nameVideo = '';
    }
  }

}

export class TooltipOverviewExample {}
