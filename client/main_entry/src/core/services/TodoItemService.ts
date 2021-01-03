import TodoItem from '../models/TodoItem';

export default class TodoItemService
{
    /**
     * Создает модели туду-заданий.
     * 
     * @param  cards 
     * @return TodoItem[]
     */
    public static createCards(cards: object[]): TodoItem[]
    {
        const newCards: TodoItem[] = [];
        
        for (const card of cards) {
            newCards.push(
                    TodoItem.getInstance(card)
                );
        }

        return newCards;
    }
}