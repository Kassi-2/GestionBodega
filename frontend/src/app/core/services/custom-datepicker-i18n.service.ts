import { TranslationWidth } from '@angular/common';
import { Injectable } from '@angular/core';
import { NgbDatepickerI18n, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

const I18N_VALUES: { [key: string]: any } = {
  'es': {
    weekdays: ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa', 'Do'],
    months: [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ],
    weekLabel: 'Sem'
  }
};

@Injectable()
export class CustomDatepickerI18n extends NgbDatepickerI18n {
  private locale: string = 'es'; // Cambiar el idioma si es necesario

  override getWeekdayLabel(weekday: number, width?: TranslationWidth): string {
    return I18N_VALUES[this.locale].weekdays[weekday - 1];
  }

  getWeekdayShortName(weekday: number): string {
    return I18N_VALUES[this.locale].weekdays[weekday - 1];
  }

  override getMonthShortName(month: number): string {
    return I18N_VALUES[this.locale].months[month - 1].substring(0,3);
  }

  override getMonthFullName(month: number): string {
    return I18N_VALUES[this.locale].months[month - 1];
  }

  override getDayAriaLabel(date: NgbDateStruct): string {
    return `${date.day}-${date.month}-${date.year}`;
  }

  override getWeekLabel(): string {
    return I18N_VALUES[this.locale].weekLabel;
  }
}
