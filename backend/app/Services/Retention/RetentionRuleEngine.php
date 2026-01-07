<?php

namespace App\Services\Retention;

use Illuminate\Database\Eloquent\Builder;

class RetentionRuleEngine
{
    /**
     * Apply rules to an Eloquent query builder.
     *
     * @param Builder $query
     * @param array $rules
     * @return Builder
     */
    public function applyRules(Builder $query, array $rules): Builder
    {
        foreach ($rules as $rule) {
            $this->applyRule($query, $rule);
        }

        return $query;
    }

    protected function applyRule(Builder $query, array $rule): void
    {
        $field = $rule['field'] ?? null;
        $operator = $rule['operator'] ?? '=';
        $value = $rule['value'] ?? null;

        if (!$field || $value === null) {
            return;
        }

        // Handle special operators or fields if necessary
        switch ($operator) {
            case 'contains':
                $query->where($field, 'like', "%{$value}%");
                break;
            case 'starts_with':
                $query->where($field, 'like', "{$value}%");
                break;
            case 'ends_with':
                $query->where($field, 'like', "%{$value}");
                break;
            default:
                 // Basic operators: =, !=, <, >, <=, >=
                $query->where($field, $operator, $value);
                break;
        }
    }
}
