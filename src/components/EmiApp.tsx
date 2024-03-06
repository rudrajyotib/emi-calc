import { Button } from "rb-base-element"
import { useState } from "react"
import { AddDisbursement } from "./functional/AddDisbursement/AddDisbursement"
import { AddLoanPlan } from "./functional/AddLoanPlan/AddLoanPlan"
import { TableData } from "./ui/table/TableProps"
import Table from "./ui/table/Table"

type Disbursement = {
    month: number,
    amount: number
}

type Disbursements = {
    schedule: Disbursement[]
}

type EmiState = {
    numberOfMonth: number,
    totalLoan: number,
    interest: number,
    emi: number,
    monthlyBreakup: { principal: number, interest: number, pendingPrincipal: number }[],
    calculated: boolean,
    disbursements: Disbursements
    paymentSchedule: MonthlySchedule[]
}

type MonthlySchedule = {
    outstanding: number,
    principalDeducted: number,
    interestDeducted: number
}

const calculateEmi = (loanAmount: number, rateOfInterest: number, tenureInMonths: number) => {
    const monthlyRateOfInterest = rateOfInterest / 1200
    const emi: number = parseInt(((loanAmount * monthlyRateOfInterest * Math.pow((1 + monthlyRateOfInterest), (tenureInMonths))) / (Math.pow((1 + monthlyRateOfInterest), tenureInMonths) - 1)).toFixed(0))
    return emi
}


const EmiApp = () => {
    const [emiState, setEmiState] = useState<EmiState>({
        numberOfMonth: 0,
        totalLoan: 0,
        interest: 0,
        emi: 0,
        monthlyBreakup: [],
        calculated: false,
        disbursements: { schedule: [] },
        paymentSchedule: []
    })

    const addDisbursement = (month: number, amount: number) => {
        setEmiState((current: EmiState) => {
            const newState = { ...current }
            const newDisbursements = current.disbursements.schedule.map((value) => {
                return {
                    month: value.month,
                    amount: value.amount
                }
            })
            newState.disbursements = {
                schedule: newDisbursements
            }
            newState.disbursements.schedule.push({ month, amount })
            console.log(JSON.stringify(newState))
            return newState
        })
    }

    const paymentSchedule = () => {
        const monthlyPayments: MonthlySchedule[] = []
        let outstanding = emiState.totalLoan
        const disbursementsMap: Map<number, number> = new Map();
        emiState.disbursements.schedule.forEach((value: Disbursement) => {
            if (disbursementsMap.has(value.month)) {
                let amt = disbursementsMap.get(value.month)
                amt = amt && amt > 0 ? amt : 0
                disbursementsMap.set(value.month,
                    amt + value.amount)
            } else {
                disbursementsMap.set(value.month, value.amount)
            }
        })
        if (disbursementsMap.size > 0) {
            let firstDisburse = disbursementsMap.get(1)
            if (firstDisburse && firstDisburse>0){
                outstanding = firstDisburse
                const outstandingForMonth = outstanding
                const interestForMonth = parseInt(((outstanding * emiState.interest) / 1200).toFixed(0))
                const principalDeducted = emiState.emi - interestForMonth
                outstanding = outstanding - principalDeducted
                monthlyPayments.push({
                    outstanding: outstandingForMonth,
                    interestDeducted: interestForMonth,
                    principalDeducted: principalDeducted
                })
            }
            for (let i = 1; i < emiState.numberOfMonth; i++) {
                if (outstanding <= 0) {
                    break
                }
                let disburseInMonth = disbursementsMap.get(i+1)
                if (disburseInMonth && disburseInMonth > 0){
                    outstanding = outstanding + disburseInMonth
                }
                const outstandingForMonth = outstanding
                const interestForMonth = parseInt(((outstanding * emiState.interest) / 1200).toFixed(0))
                const principalDeducted = emiState.emi - interestForMonth
                outstanding = outstanding - principalDeducted
                monthlyPayments.push({
                    outstanding: outstandingForMonth,
                    interestDeducted: interestForMonth,
                    principalDeducted: principalDeducted
                })
            }
        }
        else {
            for (let i = 0; i < emiState.numberOfMonth; i++) {
                if (outstanding <= 0) {
                    break
                }
                const outstandingForMonth = outstanding
                const interestForMonth = parseInt(((outstanding * emiState.interest) / 1200).toFixed(0))
                const principalDeducted = emiState.emi - interestForMonth
                outstanding = outstanding - principalDeducted
                monthlyPayments.push({
                    outstanding: outstandingForMonth,
                    interestDeducted: interestForMonth,
                    principalDeducted: principalDeducted
                })
            }
        }
        setEmiState((currentState: EmiState) => {
            const newState = { ...currentState }
            newState.calculated = true
            newState.paymentSchedule = monthlyPayments
            return newState
        })
    }

    let fullEmiBanner = <></>
    if (emiState.calculated === true) {
        fullEmiBanner = <div>
            <span> Calculated full emi::</span>{emiState.emi.toFixed(0)}
        </div>
    }
    const addLoanPlan = <AddLoanPlan onCalculate={(amount: number, tenureInMonths: number, interest: number) => {
        setEmiState((currentState: EmiState) => {
            const newState = { ...currentState }
            newState.totalLoan = amount
            newState.numberOfMonth = tenureInMonths
            newState.interest = interest
            newState.emi = calculateEmi(newState.totalLoan, newState.interest, newState.numberOfMonth)
            newState.calculated = true
            return newState
        })
    }} />

    const showDisbursements = <div style={{ display: 'flex', flexDirection: 'column', flex: 1, }}>
        {
            emiState.disbursements.schedule.map((value, index) => {
                console.log('Iterating disbursement:', index)
                return <AddDisbursement key={`AddDisbursementOuterContainer${index}`} namePrfix={`AddDisbursementContainer${index}`}
                    amount={value.amount} month={value.month} onSave={(month, amount) => {
                        setEmiState((current: EmiState) => {
                            const newState = { ...current }
                            newState.disbursements.schedule[index].amount = amount
                            newState.disbursements.schedule[index].month = month
                            console.log('new state on save::', newState)
                            return newState
                        })

                    }} />
            })
        }
    </div>


    const tableData: TableData = {
        name: 'paymentChart',
        cells: [{ cell: 'Month' }, { cell: 'Outstanding' }, { cell: 'Principal' }, { cell: 'Interest' }],
        body: []
    }

    let paymentTable = <></>

    if (emiState.calculated === true) {
        emiState.paymentSchedule.forEach((val: MonthlySchedule, index: number) => {
            tableData.body.push([{ data: index + 1 }, { data: val.outstanding }, { data: val.principalDeducted }, { data: val.interestDeducted }])
        })
        paymentTable = <Table body={tableData.body} name={tableData.name} cells={tableData.cells} />
    }


    return (<div style={{ display: 'flex', flexDirection: 'column', flex: 1, }}>
        <h1>Smart Emi Calculator</h1>
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            {addLoanPlan}
        </div>
        <div><hr /></div>
        {fullEmiBanner}
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, }}>
            <div style={{ display: 'flex', flexDirection: 'row', flex: 1 }}>
                <span>Add disbursement schedule</span>
                <Button size="large" importance="primary" name="Add Disbursement" onClick={() => {
                    addDisbursement(0, 0)
                }} />
            </div>
            {showDisbursements}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, }}>
            <div style={{ display: 'flex', flexDirection: 'row', flex: 1 }}>
                <Button size="large" importance="primary" name="Payment Schedule" onClick={() => {
                    paymentSchedule()
                }} />
            </div>
        </div>
        <div>
            <span>Total Emi </span>
            <span>{ }</span>
        </div>
        <div>
            <span>Total Emi </span>
            <span>{ }</span>
        </div>
        <div style={{ display: 'flex', flex: 1 }}>
            {
                paymentTable
            }
        </div>
    </div>)
}

export default EmiApp