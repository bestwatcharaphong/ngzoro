import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { UploadChangeParam } from 'ng-zorro-antd/upload';
import { UploadFile } from 'ng-zorro-antd/upload';
import * as XLSX from 'xlsx';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ImportService } from 'src/app/shared/services/import.service';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-importer',
  templateUrl: './importer.component.html',
  styleUrls: ['./importer.component.scss'],
})
export class ImporterComponent implements OnInit {
  fileList: File[] = [];
  dataLength = 0;
  dataSurveyApi: any;
  isUploading = false;
  importPercent: number = 0;
  errMsg: string;
  successList: string[] = [];
  failList: string[] = [];
  importDate: Date;
  importUser: string;

  constructor(
    private msg: NzMessageService,
    private importService: ImportService,
    private modal: NzModalService
  ) {}

  beforeUpload = (file: File): boolean => {
    this.fileList = [file];
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      /* read workbook */
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
      /* grab first sheet */
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      /* save data */
      const data = XLSX.utils.sheet_to_json(ws, {
        header: 1,
      }) as XLSX.AOA2SheetOpts;
      // ----

      // tslint:disable-next-line:no-string-literal

      // Meta
      const allData = data as Array<object>;
      let startUsedService: number;
      let endUsedService: number;
      let startChannel: number;
      let endChannel: number;
      let startInterestedService: number;
      let endInterestedService: number;
      let startSurvey: number;
      let endSurvey: number;
      const metaHeader = {} as object;
      const mapper = {
        Month: 'month',
        วันที่เก็บแบบประเมิน: 'survey_date',
        ครั้งที่สัมภาษณ์: 'survey_no',
        'Customer Id': 'customer_code',
        'Customer name': 'customer_name',
        มูลค่าสัญญารวม: 'cost',
        ทีมขาย: 'sale_team',
        เจ้าหน้าที่ขาย: 'sale_name',
        ชื่อ: 'first_name',
        นามสกุล: 'last_name',
        ตำแหน่ง: 'position',
        โทรศัพท์: 'tel1',
        เบอร์อื่นๆ: 'tel2',
        เบอร์ที่ทำงาน: 'office_tel',
        Email: 'mail',
        ระดับการตัดสินใจ: 'authorized',
        ข้อเสนอแนะอื่นๆ: 'comment',
      } as object;
      const surveyData = {} as object;
      // tslint:disable-next-line:no-string-literal
      surveyData['data'] = [] as Array<object>;
      for (const [i, row] of allData.entries()) {
        //allData.forEach((row, i) => {
        if (i === 0) {
          const rowData = row as Array<any>;
          rowData.forEach((v, k) => {
            // map header
            if (mapper[v]) {
              metaHeader[k] = mapper[v];
            }

            // #region :: find position used service
            if (v === 'Used Service') {
              startUsedService = k;
            } else if (endUsedService === undefined) {
              if (startUsedService !== undefined && v !== undefined) {
                endUsedService = k;
              }
            }
            // #endregion

            // #region :: find position channel ช่องทางการสื่อสาร
            if (v === 'ช่องทางการสื่อสาร') {
              startChannel = k;
            } else if (endChannel === undefined) {
              if (startChannel !== undefined && v !== undefined) {
                endChannel = k;
              }
            }
            // #endregion

            // #region :: find position Interested Service
            if (v === 'Interested Service') {
              startInterestedService = k;
            } else if (endInterestedService === undefined) {
              if (startInterestedService !== undefined && v !== undefined) {
                endInterestedService = k;
              }
            }

            // #endregion

            // #region :: find position Survey
            if (v === 'Score in each Services') {
              startSurvey = k;
            } else if (endSurvey === undefined) {
              if (startSurvey !== undefined && v !== undefined) {
                endSurvey = k;
              }
            }
            // #endregion
          });

          // #region :: check is correct header
          if (
            `${Object.values(metaHeader) as string[]}` ===
              `${Object.values(mapper) as string[]}` &&
            startChannel !== undefined &&
            startUsedService !== undefined &&
            startInterestedService !== undefined &&
            startSurvey !== undefined
          ) {
          } else {
            this.clearUploadData();
            this.modal.error({
              nzTitle: 'พบข้อผิดพลาด',
              nzContent:
                'รูปแบบฟอร์มของคุณไม่ถูกต้อง กรุณาติดต่อผู้ดูแลระบบเพื่อปรับแม่แบบของฟอร์ม',
            });
            break;
          }
          // #endregion
        }
        // #region :: push data to jsonData
        if (i >= 3) {
          const source = allData[i];
          const jsonData = {} as object;
          // #region :: metadata to json data
          // tslint:disable-next-line:no-string-literal
          jsonData['metadata'] = {} as object;
          // tslint:disable-next-line:forin
          for (const m in metaHeader) {
            // tslint:disable-next-line:no-string-literal
            if (metaHeader[m] === 'survey_date') {
              source[m] = new Date(source[m]);
            }
            jsonData['metadata'][metaHeader[m]] = source[m] || null;
          }
          // #endregion

          // #region :: push used service to json data
          const usedService = [] as Array<any>;
          for (let s = startUsedService; s < endUsedService; s++) {
            if (source[s] === 1) {
              usedService.push(allData[2][s]);
            }
          }
          // tslint:disable-next-line:no-string-literal
          jsonData['used_service'] = usedService;
          // #endregion
          // #region :: push channel to json data
          const channel = {} as object;
          for (let s = startChannel; s < endChannel; s++) {
            if (source[s] === undefined) {
              source[s] = null;
            }
            channel[allData[2][s]] = `${source[s]}`;
          }
          // tslint:disable-next-line:no-string-literal
          jsonData['channel'] = channel;
          // #endregion
          // #region :: push interested service to json data
          const interestedService = {} as object;
          for (let s = startInterestedService; s < endInterestedService; s++) {
            if (source[s] === undefined) {
              source[s] = null;
            }

            interestedService[allData[2][s]] = `${source[s]}`;
          }
          // tslint:disable-next-line:no-string-literal
          jsonData['interested_service'] = interestedService;
          // #endregion
          // #region :: push survey to json data
          const survey = {} as object;
          let category: string;
          let prevCategory: string;

          for (let s = startSurvey; s < endSurvey; s++) {
            category = allData[1][s] || prevCategory;

            if (category !== undefined && category !== prevCategory) {
              prevCategory = category;
              survey[category] = {} as object;
            }
            if (source[s] === undefined) {
              source[s] = null;
            }
            survey[category][allData[2][s]] = `${source[s]}`;
          }
          // tslint:disable-next-line:no-string-literal
          jsonData['survey'] = survey;
          // #endregion

          // tslint:disable-next-line:no-string-literal
          surveyData['data'].push(jsonData);
        }

        // #endregion
      }
      // });

      // #region :: for show on html and call api
      // tslint:disable-next-line:no-string-literal
      this.dataLength = surveyData['data'].length;
      this.dataSurveyApi = surveyData;
      this.importDate = new Date();
      this.importUser = localStorage.getItem('username');
      // tslint:disable-next-line:no-string-literal
      this.dataSurveyApi['import_info'] = {
        account_id: '1',
        file_name: file.name,
        record: this.dataLength,
      } as object;

      // #endregion
    };
    reader.readAsBinaryString(file);
    return false;
  };

  ngOnInit(): void {}

  clearUploadData() {
    this.isUploading = false;
    this.dataLength = 0;
    this.importPercent = 0;
    this.errMsg = '';
    this.dataSurveyApi = null;
    this.fileList = [];
    this.successList = [];
    this.failList = [];
    this.importDate = null;
    this.importUser = '';
    console.log(this.dataLength);
  }
  handleUpload() {
    console.log(this.dataSurveyApi);
    this.isUploading = true;
    this.importService
      .createImportInfo(this.dataSurveyApi.import_info)
      .subscribe(
        (resp) => {
          console.log(resp);
          let cImport = 0;
          for (const s of this.dataSurveyApi.data) {
            console.log(s);
            const d = {
              import_info: this.dataSurveyApi.import_info,
              data: s,
            };
            this.importService.importSurvey(d).subscribe(
              (res) => {
                cImport += 1;
                console.log(cImport);
                this.importPercent = (cImport / this.dataLength) * 100;
                console.log(s);
                this.successList.push(
                  `${s.metadata.customer_code}:${s.metadata.survey_no}`
                );
                if (cImport === this.dataLength) {
                  let msg = `<b>ผลการนำเข้า</b><br/>จำนวนทั้งหมด: ${this.dataLength}</br>สำเร็จ: ${this.successList.length} <br/>ไม่สำเร็จ: ${this.failList.length} <br/> </br> *หมายเหตุ หากไม่สำเร็จอาจเกิดจากคุณเคยนำเข้าข้อมูลการประเมินไปแล้ว`;
                  this.modal.info({
                    nzTitle: 'นำเข้าข้อมูลเสร็จสิ้น',
                    nzContent: msg,
                  });
                  this.clearUploadData();
                }
              },
              (err) => {
                console.log(err);
                cImport += 1;
                console.log(cImport);
                this.importPercent = (cImport / this.dataLength) * 100;
                let cause = 'unknown';
                if (err.error.error === 'duplicate survey') {
                  cause = 'duplicate';
                }
                this.failList.push(
                  `${s.metadata.customer_code}:${s.metadata.survey_no}:${cause}`
                );
                if (cImport === this.dataLength) {
                  let msg = `<b>ผลการนำเข้า</b><br/>จำนวนทั้งหมด: ${this.dataLength}</br>สำเร็จ: ${this.successList.length} <br/>ไม่สำเร็จ: ${this.failList.length} <br/> </br> *หมายเหตุ หากไม่สำเร็จอาจเกิดจากคุณเคยนำเข้าข้อมูลการประเมินไปแล้ว`;
                  this.modal.info({
                    nzTitle: 'นำเข้าข้อมูลเสร็จสิ้น',
                    nzContent: msg,
                  });
                  this.clearUploadData();
                }
              }
            );
          }
          console.log('testttt');
        },
        (err) => {
          console.log(err.error);
          this.isUploading = false;
          this.fileList = [];
          let msg = 'กรุณาติดต่อผู้ดูแลระบบ';
          if (err.error.result === 'duplicate import info.') {
            msg = 'พบการอัพโหลดไฟล์ซ้ำ กรุณาตรวจสอบชื่อไฟล์';
          }
          this.modal.error({
            nzTitle: 'มีข้อผิดพลาดเกิดขึ้น',
            nzContent: msg,
          });
          this.clearUploadData();
        }
      );
  }
}
