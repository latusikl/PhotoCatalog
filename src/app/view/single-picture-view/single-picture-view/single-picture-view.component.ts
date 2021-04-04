import { Component, HostBinding, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ImageData } from 'src/app/model/ImageData';
import { ImageDataContract } from '../../../model/ImageDataContract';
import { ImageDataFacade } from '../../../model/ImageDataFacade';

@Component({
    selector: 'app-single-picture-view',
    templateUrl: './single-picture-view.component.html',
    styleUrls: ['./single-picture-view.component.scss'],
})
export class SinglePictureViewComponent implements OnInit {
    imageDataFacade?: ImageDataFacade;
    shouldDisplayImgView = false;

    @HostBinding('class')
    class = 'view';

    constructor(private location: Location) {}

    isImageDataContract(object: unknown): object is ImageDataContract {
        if (object) {
            const objectAsImageDataContract: ImageDataContract = object as ImageDataContract;
            return objectAsImageDataContract.name !== undefined && objectAsImageDataContract.path !== undefined;
        }
        return false;
    }

    ngOnInit(): void {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const passedData: unknown = this.location.getState().imgData;

        // if (this.isImageDataContract(passedData)) {
        // this.imageDataFacade = new ImageDataFacade(
        //     new ImageData(passedData.name, passedData.path, passedData.exifData),
        this.imageDataFacade = new ImageDataFacade(new ImageData(MOCK_DATA.name, MOCK_DATA.path, MOCK_DATA.exifData));
        this.shouldDisplayImgView = true;
        // }
    }

    chooseSinglePicture(): void {
        //TODO Add Implementation in next steps of feature development
        console.error('NOT IMPLEMENTED');
    }

    getImgPath(): string {
        return this.imageDataFacade ? this.imageDataFacade.imageData.path : '';
    }
}

const MOCK_DATA: ImageDataContract = {
    name: 'Canon_40D',
    path: 'file:////Users/i324078/Desktop/exif-samples/jpg/wide-jpg.jpg',
    exifData: {
        '0th': {
            '271': 'Canon',
            '272': 'Canon EOS 40D',
            '274': 1,
            '282': [72, 1],
            '283': [72, 1],
            '296': 2,
            '305': 'GIMP 2.4.5',
            '306': '2008:07:31 10:38:11',
            '531': 2,
            '34665': 214,
            '34853': 978,
        },
        '1st': {
            '259': 6,
            '282': [72, 1],
            '283': [72, 1],
            '296': 2,
            '513': 1090,
            '514': 1378,
        },
        Exif: {
            '33434': [1, 160],
            '33437': [71, 10],
            '34850': 1,
            '34855': 100,
            '36864': '0221',
            '36867': '2008:05:30 15:56:01',
            '36868': '2008:05:30 15:56:01',
            '37121': '\u0001\u0002\u0003\u0000',
            '37377': [483328, 65536],
            '37378': [368640, 65536],
            '37380': [0, 1],
            '37383': 5,
            '37385': 9,
            '37386': [135, 1],
            '37510':
                '\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000',
            '37520': '00',
            '37521': '00',
            '37522': '00',
            '40960': '0100',
            '40961': 1,
            '40962': 100,
            '40963': 68,
            '40965': 948,
            '41486': [3888000, 876],
            '41487': [2592000, 583],
            '41488': 2,
            '41985': 0,
            '41986': 1,
            '41987': 0,
            '41990': 0,
        },
        GPS: {
            '0': [2, 2, 0, 0],
        },
        Interop: {
            '1': 'R98',
        },
        thumbnail:
            "ÿØÿà\u0000\u0010JFIF\u0000\u0001\u0001\u0000\u0000\u0001\u0000\u0001\u0000\u0000ÿÛ\u0000C\u0000\u000b\b\b\n\b\u0007\u000b\n\t\n\r\f\u000b\r\u0011\u001c\u0012\u0011\u000f\u000f\u0011\"\u0019\u001a\u0014\u001c)$+*($''-2@7-0=0''8L9=CEHIH+6OUNFT@GHEÿÛ\u0000C\u0001\f\r\r\u0011\u000f\u0011!\u0012\u0012!E.'.EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEÿÀ\u0000\u0011\b\u0000.\u0000D\u0003\u0001\"\u0000\u0002\u0011\u0001\u0003\u0011\u0001ÿÄ\u0000\u001f\u0000\u0000\u0001\u0005\u0001\u0001\u0001\u0001\u0001\u0001\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0001\u0002\u0003\u0004\u0005\u0006\u0007\b\t\n\u000bÿÄ\u0000µ\u0010\u0000\u0002\u0001\u0003\u0003\u0002\u0004\u0003\u0005\u0005\u0004\u0004\u0000\u0000\u0001}\u0001\u0002\u0003\u0000\u0004\u0011\u0005\u0012!1A\u0006\u0013Qa\u0007\"q\u00142¡\b#B±Á\u0015RÑð$3br\t\n\u0016\u0017\u0018\u0019\u001a%&'()*456789:CDEFGHIJSTUVWXYZcdefghijstuvwxyz¢£¤¥¦§¨©ª²³´µ¶·¸¹ºÂÃÄÅÆÇÈÉÊÒÓÔÕÖ×ØÙÚáâãäåæçèéêñòóôõö÷øùúÿÄ\u0000\u001f\u0001\u0000\u0003\u0001\u0001\u0001\u0001\u0001\u0001\u0001\u0001\u0001\u0000\u0000\u0000\u0000\u0000\u0000\u0001\u0002\u0003\u0004\u0005\u0006\u0007\b\t\n\u000bÿÄ\u0000µ\u0011\u0000\u0002\u0001\u0002\u0004\u0004\u0003\u0004\u0007\u0005\u0004\u0004\u0000\u0001\u0002w\u0000\u0001\u0002\u0003\u0011\u0004\u0005!1\u0006\u0012AQ\u0007aq\u0013\"2\b\u0014B¡±Á\t#3Rð\u0015brÑ\n\u0016$4á%ñ\u0017\u0018\u0019\u001a&'()*56789:CDEFGHIJSTUVWXYZcdefghijstuvwxyz¢£¤¥¦§¨©ª²³´µ¶·¸¹ºÂÃÄÅÆÇÈÉÊÒÓÔÕÖ×ØÙÚâãäåæçèéêòóôõö÷øùúÿÚ\u0000\f\u0003\u0001\u0000\u0002\u0011\u0003\u0011\u0000?\u0000áo%7eî\u0019F\u000e\u0006Üûuª¶à´7o)\u0018òzÖÑA*ê\u0016òî\u001fÂÄ\u0011ø\u001a¯=ö\u0017H°1¯;ÀÈ®HÊ/DSM²ÒJdÓ&·90ÆÁþèÏZ©jð²Ë\f#(OPkkKS\u001cåU\u0019&\u001b\\0á'Ùc2lH×>¸èj£\u0016\r\u001c÷É\u0011±Éã\u0002Y¼ª*\tî:WK\u001d Fc°^zqS\fºË\u0002ùC¦ÕÁ\u0002­è\u00169]M®$@ãÊ>R¸]¢ª«'\t\\°<\u0003]ÊÚC\n¶øAV\u0004mnzãüþ5Å_yK{8p»Î1ü\"VBhDXeÉ÷¢ª\u0002õ¢BÌ¿wou4ìÒ@ÁÎ\u0000\n;{U«{\u0019\\¡Ô.\u001bj\u00198ö«Ó_<)·O-ÜdçëNÝåbîØ'n¿ç¥$hØø.\u0002¡~US¢­iùÏ!oº\u0006I\u001d}ª)\u0007ËQ³\u0019È ×µ1ÛÙ¡`K3`\u0005ÎIú\n§µ[²t²Y\u0017t_xpÇ®?Î*D,dLÇNÑNkæVû?(HÎÀK\u000fP\bæ¨ßj\u0010Áf×\u000eÊ@\u0018BAçÓÞ³qes_b¾§©Án´m8àìO9ÆqÒ¸É£Ì¬ûBï$ñOî]BWr\u000eÍÇ\u001e VYÙ,\u0011+ï<1aÓéUu\u001d\nngÁfò¡e\fFqÒÝû\"'\u0010ß NÀQSÎiÈAi4m\u0010sÁ'¯s+RmB8NvòF2½¿\næäÓ\rüC\u001eÜÖ\u000eÙ\"©­QëÕwádÇ\u0000ñsêw)\fryI\u001a!\f$\u0007¿pGæ*\t`G\f\u0019T3TÌ¤ÚI,»ÕØL¾53y\u0014kó/åÔ¯UÈíè*õó\u0014Ó£Fe7\u0019\n_§\u0015k\nª \u0003ï¹Ýô\u0015¹ck\u000e³ ,l\u0019.¡¹#y9\u001cþ\u0015çÊi\u0018ÜÌJ;42\u0004ó\tþ\u001e¢¤]\n\u001f³\u0019L¸ á¯Egegm4îI<CaËerxÈ\u0015\u000bi\u00043:\tË\u0001ÓØÑ¦+m\u001bNhAâTN(®`ÍsûÜýh«å}Éæ?ÿÙ",
    },
};
