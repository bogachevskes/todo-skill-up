import moment from 'moment';

export default class DateHelper
{
    /**
     * Преобразует строку даты в нужный формат.
     * 
     * @param  string date 
     * @param  string from 
     * @param  string to 
     * @return string
     */
    public static printFormatted(date: string, to: string = 'DD.MM.YYYY HH:mm:ss', from: string = 'YYYY-MM-DD HH:mm:ss'): string
    {
        return moment(date, from).format(to);
    }

    /**
     * Форматирует объект
     * даты в строку по формату.
     * 
     * @param Date date 
     * @param string to 
     */
    public static format(date: Date, to: string = 'DD.MM.YYYY HH:mm:ss'): string
    {
        return moment(date).format(to);
    }

}
