export default class CaseHelper
{
    /**
     * Делает первую букву строки заглавной.
     * 
     * @param string 
     * @return string
     */
    public static capitalize(string: string): string
    {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
}