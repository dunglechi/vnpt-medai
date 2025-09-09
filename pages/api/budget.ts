import type { NextApiRequest, NextApiResponse } from 'next'

export interface BudgetData {
  id: string
  month: string
  allocated: number
  spent: number
  remaining: number
  services: {
    name: string
    allocated: number
    spent: number
  }[]
}

export interface BudgetResponse {
  currentBudget: BudgetData
  budgetHistory: BudgetData[]
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<BudgetResponse>
) {
  // Mock budget data
  const currentBudget: BudgetData = {
    id: '1',
    month: 'January 2024',
    allocated: 1000.00,
    spent: 541.25,
    remaining: 458.75,
    services: [
      {
        name: 'Medical Image Analysis',
        allocated: 400.00,
        spent: 245.50
      },
      {
        name: 'Symptom Analysis',
        allocated: 300.00,
        spent: 156.75
      },
      {
        name: 'Drug Interaction Check',
        allocated: 200.00,
        spent: 89.00
      },
      {
        name: 'Diagnostic Assistance',
        allocated: 100.00,
        spent: 50.00
      }
    ]
  }

  const budgetHistory: BudgetData[] = [
    {
      id: '2',
      month: 'December 2023',
      allocated: 900.00,
      spent: 876.30,
      remaining: 23.70,
      services: [
        {
          name: 'Medical Image Analysis',
          allocated: 350.00,
          spent: 340.20
        },
        {
          name: 'Symptom Analysis',
          allocated: 300.00,
          spent: 298.10
        },
        {
          name: 'Drug Interaction Check',
          allocated: 150.00,
          spent: 148.00
        },
        {
          name: 'Diagnostic Assistance',
          allocated: 100.00,
          spent: 90.00
        }
      ]
    },
    {
      id: '3',
      month: 'November 2023',
      allocated: 800.00,
      spent: 723.45,
      remaining: 76.55,
      services: [
        {
          name: 'Medical Image Analysis',
          allocated: 300.00,
          spent: 287.15
        },
        {
          name: 'Symptom Analysis',
          allocated: 250.00,
          spent: 234.30
        },
        {
          name: 'Drug Interaction Check',
          allocated: 150.00,
          spent: 122.00
        },
        {
          name: 'Diagnostic Assistance',
          allocated: 100.00,
          spent: 80.00
        }
      ]
    }
  ]

  res.status(200).json({
    currentBudget,
    budgetHistory
  })
}