import {Component, OnDestroy} from '@angular/core';
import {ShopService} from '../../services/shop.service';
import {Subscription} from 'rxjs';
import {SnackBarService} from '../../services/snack-bar.service';
import {saveAs} from 'file-saver';
import {HttpResponse} from '@angular/common/http';

@Component({
	selector: 'app-report',
	templateUrl: './report.component.html',
	styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnDestroy {

	private subscriptions: Subscription[] = [];

	date: Date = new Date();
	maxDate: Date = new Date();

	hour: number = new Date().getHours() - 1;

	reportData: string[][] = [];
	isReportLoaded: boolean = false;

	displayedColumns: string[] = ['id', 'userId', 'productId', 'quantity', 'unitPrice', 'timestamp'];

	constructor(private shopService: ShopService, private snackBarService: SnackBarService) {

	}

	ngOnDestroy(): void {
		this.subscriptions.forEach((subscription: Subscription): void => {
			subscription.unsubscribe();
		});
	}

	setHour(hour: number): void {
		this.hour = hour;
	}

	setDate(date: Date): void {
		this.date = date;
	}

	downloadReport(): void {
		const subscription: Subscription = this.shopService.getReportDataBlob$(this.getFormattedDateTime())
			.subscribe((blobResponse: HttpResponse<Blob>): void => {
				if (!blobResponse.body) return;

				const filename: string | undefined = blobResponse.headers.get('content-disposition')?.split('; filename=')[1];
				saveAs(blobResponse.body, filename);
			});
		this.subscriptions.push(subscription);
	}

	getReport(): void {
		if (this.hour > new Date().getHours() - 1) {
			this.snackBarService.displaySnackBar($localize`❌ Report for selected hour isn\'t generated yet`);
			return;
		}

		const subscription: Subscription = this.shopService.getReportData$(this.getFormattedDateTime())
			.subscribe((reportData: string): void => {
				const processedReportData: string[][] = this.getFormattedReportData(reportData);

				if (processedReportData.length === 0) {
					this.isReportLoaded = false;
					this.snackBarService.displaySnackBar($localize`❌ No orders were made during selected hour`);
					return;
				}

				this.reportData = processedReportData;
				this.isReportLoaded = true;
			});
		this.subscriptions.push(subscription);
	}

	getFormattedReportData(reportData: string): string[][] {
		const result: string[][] = [];
		reportData.split('\n')
			.forEach((line: string, index: number): void => {
				if (index == 0) return;

				result.push(line.replaceAll('\"', '').split(','));
			})
		result.pop();
		return result;
	}

	getFormattedDateTime(): string {
		const formattedHour: string = this.hour.toString().length == 1
			? `0${this.hour}:00`
			: `${this.hour}:00`;
		return `${this.getFormattedDate()}T${formattedHour}`;
	}

	getFormattedDate(): string {
		const month: number = this.date.getMonth() + 1;
		const formattedMonth: string = month.toString().length === 1
			? `0${month}`
			: month.toString();
		const formattedDay: string = this.date.getDate().toString().length === 1
			? `0${this.date.getDate()}`
			: this.date.getDate().toString();
		return `${this.date.getFullYear()}-${formattedMonth}-${formattedDay}`;
	}
}
