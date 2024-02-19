<?php

namespace Tests\Support;

trait FailSchemeTrait
{
    protected array $failScheme = [
        'type' => 'object',
        'properties' => [
            'cause' => ['type' => 'string'],
            'type' => ['type' => 'string'],
            'data' => ['type' => 'array'],
        ],
        'required' => ['cause', 'type', 'data'],
        'additionalProperties' => false,
    ];
}