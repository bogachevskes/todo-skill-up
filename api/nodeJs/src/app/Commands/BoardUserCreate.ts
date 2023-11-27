import BaseCommand from '../../Framework/Base/BaseCommand';
import UserRepository from '../Repository/UserRepository';
import User from '../Entity/User';
import BoardsRepository from "../Repository/BoardsRepository";

export default class BoardUserCreate extends BaseCommand
{
    protected userRepository: UserRepository;

    protected boardsRepository: BoardsRepository;

    public constructor(userRepository: UserRepository, boardsRepository: BoardsRepository) {
        super();
        this.userRepository = userRepository;
        this.boardsRepository = boardsRepository;
    }


    /**
     * @see BaseCommand
     */
    protected async handle(): Promise<void>
    {
        const warnings: object = {
            'users': {
                'not_exist': [],
            },
        };

        const ids = this.context.get('ids');

        for (const key in ids) {
            const id = Number(ids[key]),
                user: User|null = await this.userRepository.findById(id);

            if (user === null) {

                warnings['users']['not_exist'].push(id);

                continue;
            }

            if (await this.boardsRepository.isUserExistsInGroup(this.context.get('todo_group_id'), user.id) === true) {
                continue;
            }

            await this.boardsRepository.createUserToBoardAssignment(this.context.get('todo_group_id'), user.id)
                .save();
        }

        this.context.set('warnings', warnings);
    }
}