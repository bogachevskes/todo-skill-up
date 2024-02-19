<?php

namespace tests\integration\api\users;

use Tests\Support\{
    ApiTester,
    FailSchemeTrait,
    UserTrait,
    HashTrait,
};

class UsersPermissionsCest
{
    use FailSchemeTrait, UserTrait, HashTrait;

    public function testListCurrentUserPermissions(ApiTester $I): void
    {
        $I->wantTo('Получить разрешения пользователя');

        [$permissionsOwnerUserId, $permissionsOwnerUserEmail] = $this->createUser($I);

        $role = $this->generateHash();
        $permission = $this->generateHash();

        $I->haveInDatabase('auth_item', [
            'name' => $role,
            'type' => 1,
        ]);

        $I->haveInDatabase('auth_item', [
            'name' => $permission,
            'type' => 2,
        ]);

        $I->haveInDatabase('auth_item_child', [
            'parent' => $role,
            'child' => $permission,
        ]);

        $I->haveInDatabase('auth_assignment', [
            'item_name' => $role,
            'user_id' => $permissionsOwnerUserId,
        ]);

        $I->haveHttpHeader('X-BASE-AUTH', $permissionsOwnerUserEmail);

        $I->sendGet("/v1/user/$permissionsOwnerUserId/permissions");

        $I->seeResponseCodeIs(200);
        $I->seeResponseContainsJson([
            $permission,
        ]);
    }

    public function testListPermissionsFailOnAnotherUser(ApiTester $I): void
    {
        $I->wantTo('Получить ошибку недоступности разрешений другого пользователя');

        [$guestUserId, $guestUserEmail] = $this->createUser($I);

        [$permissionsOwnerUserId, $permissionsOwnerUserEmail] = $this->createUser($I);

        $role = $this->generateHash();
        $permission = $this->generateHash();

        $I->haveInDatabase('auth_item', [
            'name' => $role,
            'type' => 1,
        ]);

        $I->haveInDatabase('auth_item', [
            'name' => $permission,
            'type' => 2,
        ]);

        $I->haveInDatabase('auth_item_child', [
            'parent' => $role,
            'child' => $permission,
        ]);

        $I->haveInDatabase('auth_assignment', [
            'item_name' => $role,
            'user_id' => $permissionsOwnerUserId,
        ]);

        $I->haveHttpHeader('X-BASE-AUTH', $guestUserEmail);

        $I->sendGet("/v1/user/$permissionsOwnerUserId/permissions");
        $I->seeResponseCodeIs(403);
        $I->seeResponseIsValidOnJsonSchemaString(json_encode($this->failScheme));
    }
}