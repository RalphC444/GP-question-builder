import React from 'react';
import {
  Box,
  TextField,
  FormGroup,
  FormControlLabel,
  Checkbox,
  RadioGroup,
  Radio,
  Button,
  Typography,
  Slider,
} from '@mui/material';
import { Question } from '../types/question';

interface QuestionInputProps {
  question: Question;
  value: any;
  onChange: (value: any) => void;
}

export function QuestionInput({ question, value, onChange }: QuestionInputProps) {
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleSingleChoiceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleMultipleChoiceChange = (optionId: string, checked: boolean) => {
    const currentValues = value || [];
    if (checked) {
      onChange([...currentValues, optionId]);
    } else {
      onChange(currentValues.filter((id: string) => id !== optionId));
    }
  };

  const handleRatingChange = (rating: number) => {
    onChange(rating);
  };

  const handleRankingChange = (criteriaId: string, newValue: number) => {
    const currentValues = value || {};
    onChange({
      ...currentValues,
      [criteriaId]: newValue,
    });
  };

  switch (question.type) {
    case 'text':
      return (
        <TextField
          fullWidth
          placeholder="Your answer"
          multiline
          rows={4}
          value={value || ''}
          onChange={handleTextChange}
        />
      );

    case 'multiple-choice':
      return (
        <FormGroup>
          {question.options?.map((option) => (
            <FormControlLabel
              key={option.id}
              control={
                <Checkbox
                  checked={(value || []).includes(option.id)}
                  onChange={(e) => handleMultipleChoiceChange(option.id, e.target.checked)}
                />
              }
              label={option.text}
            />
          ))}
        </FormGroup>
      );

    case 'single-choice':
      return (
        <RadioGroup
          value={value || ''}
          onChange={handleSingleChoiceChange}
        >
          {question.options?.map((option) => (
            <FormControlLabel
              key={option.id}
              value={option.id}
              control={<Radio />}
              label={option.text}
            />
          ))}
        </RadioGroup>
      );

    case 'rating':
      return (
        <Box sx={{ display: 'flex', gap: 1 }}>
          {[...Array(question.ratingScale || 5)].map((_, i) => (
            <Button
              key={i}
              variant={value === i + 1 ? "contained" : "outlined"}
              onClick={() => handleRatingChange(i + 1)}
              sx={{ minWidth: 40 }}
            >
              {i + 1}
            </Button>
          ))}
        </Box>
      );

    case 'ranking':
      return (
        <Box sx={{ mt: 2 }}>
          {question.rankingCriteria?.map((criteria) => (
            <Box key={criteria.id} sx={{ mb: 3 }}>
              <Typography variant="subtitle2" gutterBottom>
                {criteria.text}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Not Important
                </Typography>
                <Slider
                  value={(value || {})[criteria.id] || criteria.weight}
                  min={1}
                  max={5}
                  step={1}
                  marks={[
                    { value: 1, label: '1' },
                    { value: 2, label: '2' },
                    { value: 3, label: '3' },
                    { value: 4, label: '4' },
                    { value: 5, label: '5' },
                  ]}
                  onChange={(_, newValue) => handleRankingChange(criteria.id, newValue as number)}
                  sx={{ flex: 1 }}
                />
                <Typography variant="body2" color="text.secondary">
                  Very Important
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      );

    case 'matrix':
      if (!question.matrixConfig) return null;
      return (
        <Box sx={{ mt: 2, overflowX: 'auto' }}>
          <table style={{ borderCollapse: 'collapse', width: '100%' }}>
            <thead>
              <tr>
                <th style={{ width: 120 }}></th>
                {(question.matrixConfig.columns || []).map(col => (
                  <th key={col.id} style={{ padding: 8, border: '1px solid #e0e0e0', background: '#fafafa', fontWeight: 600 }}>{col.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(question.matrixConfig.rows || []).map(row => (
                <tr key={row.id}>
                  <td style={{ padding: 8, border: '1px solid #e0e0e0', background: '#fafafa', fontWeight: 500 }}>{row.label}</td>
                  {(question.matrixConfig.columns || []).map(col => (
                    <td key={col.id} style={{ padding: 8, border: '1px solid #e0e0e0', textAlign: 'center' }}>
                      <Radio
                        checked={value && value[row.id] === col.id}
                        onChange={() => {
                          onChange({ ...value, [row.id]: col.id });
                        }}
                        value={col.id}
                        name={`matrix-${question.id}-row-${row.id}`}
                        color="primary"
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </Box>
      );

    default:
      return null;
  }
} 