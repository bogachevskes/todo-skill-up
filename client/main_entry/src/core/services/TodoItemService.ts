import TodoItem from '../models/TodoItem';

export default class TodoItemService
{
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