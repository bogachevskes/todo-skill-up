<?php

namespace Tests\Support;

trait HashTrait
{
    protected array $usedHashes = [];

    private function generateHash(int $length = 10): string
    {
        $result = null;

        while ($result === null || in_array($result, $this->usedHashes)) {
            $bytes = random_bytes($length);
            $hash = bin2hex($bytes);
            $result = substr($hash, 0, $length);
        }

        return $result;
    }
}