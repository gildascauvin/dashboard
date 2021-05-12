import {Component, Inject, Input, OnInit, Pipe, PipeTransform} from '@angular/core';
import {Router} from "@angular/router";
import {DomSanitizer} from "@angular/platform-browser";
import {DOCUMENT} from "@angular/common";
import {ResizeService} from "../../../services/ui/resize-service.service";
import {UsersService} from "../../users.service";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'popover',
  templateUrl: 'popover.component.html',
  styleUrls: ['./popover.component.scss']
})

export class PopoverComponent implements OnInit, PipeTransform {
  @Pipe({ name: 'safe' })
  @Input() movement: any;
  @Input() newMovementIcon: any;

  size: number = 1;
  responsiveSize: number = 768;

  popoverClass: string = 'popover--update-url';
  popoverAutoClose: any = true;

  isVideo: boolean = false;
  videoSrc: any = 'https://www.youtube.com/embed/7wvg71IDoAE';
  videoWidth: number = 560;
  videoHeight: number = 315;

  HOST_YOUTUBE: string = 'www.youtube.com';
  SHORT_HOST_YOUTUBE: string = 'youtu.be';

  constructor(
    private router: Router,
    private sanitizer: DomSanitizer,
    @Inject(DOCUMENT) private _document,
    private resizeSvc: ResizeService,
    private usersService: UsersService,
    private toastrService: ToastrService,
  ) {

  }

  ngOnInit() {

    this.detectScreenSize();

    if (this.size <= this.responsiveSize) {
      this.videoWidth = 280;
      this.videoHeight = 150;
    }

    this._initPopover();
  }

  updateMovementForm() {
    console.log(this.newMovementIcon);
    console.log(this.movement);

    let model = {
      movement_id: this.movement.movement_id,
      icon: this.newMovementIcon
    };

    this.usersService.updateMovement(model)
      .subscribe((response: any) => {
        if (response.errors) {
          this.toastrService.error(response.message);
        } else {
          this.toastrService.success("#Movement update!");
          this.movement = response.movement;
          this._initPopover();
        }
      });
  }

  private _initPopover()
  {
    if (this.movement.icon == '') {
      this.popoverAutoClose = 'outside';
    } else {
      try {
        let url = new URL(this.movement.icon);

        console.log(url);

        if (url.host == this.HOST_YOUTUBE) {
          let videoId = url.searchParams.get('v');
          this.videoSrc = 'https://www.youtube.com/embed/' + videoId;

          this.videoSrc = this.transform(this.videoSrc);
          this.popoverClass = 'popover--video';
          this.isVideo = true;
        } else {
          this.popoverClass = '';
          this.isVideo = false;
        }
      } catch(e) {

      }
    }
  }

  transform(url) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  private detectScreenSize() {
    const currentSize = this._document.body.clientWidth;
    this.size = currentSize;
    this.resizeSvc.onResize(currentSize);
  }

  private _computeVideoUrl() {
    /*
      $parts = parse_url($url);
      $blockEditUrl = $this->getRouter()->generate('mywholesaleoffice_custom_editorial_block_edit', ['id' => $blockId, 'profile' => $profile]);

      if (isset($parts['host']) === false) {
        throw new BadUrlException(sprintf('Bad url <b>%s</b> format for Youtube Video, <a href="' . $blockEditUrl . '">please define a valid url</a>.', $url));
      }

      switch ($parts['host']) {
        case self::SHORT_HOST_YOUTUBE:
          $videoId = trim(str_replace('/', '', $parts['path']));
          break;
        case self::HOST_YOUTUBE:
          parse_str($parts['query'], $query);
          $videoId = $query['v'];
          break;
        default:
          throw new BadUrlException(sprintf('Bad url <b>%s</b> format for Youtube Video, <a href="' . $blockEditUrl . '">please define a valid url</a>.', $url));
      }

      return BlockMedia::LINK_YOUTUBE_EMBED . $videoId . '?enablejsapi=1';

   */
  }
}
