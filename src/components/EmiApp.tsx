import { Button } from "rb-base-element"
import { useState } from "react"
import { AddDisbursement } from "./functional/AddDisbursement/AddDisbursement"
import { AddLoanPlan } from "./functional/AddLoanPlan/AddLoanPlan"
import { TableData } from "./ui/table/TableProps"
import Table from "./ui/table/Table"
import { AddRepayment } from "./functional/AddRepayment/AddRepayment"

type Disbursement = {
    month: number,
    amount: number
}

type Disbursements = {
    schedule: Disbursement[]
}

type Repayment = {
    month: number,
    amount: number
}

type Repayments = {
    schedule: Repayment[]
}

type EmiState = {
    numberOfMonth: number,
    totalLoan: number,
    interest: number,
    emi: number,
    monthlyBreakup: { principal: number, interest: number, pendingPrincipal: number }[],
    calculated: boolean,
    disbursements: Disbursements
    amortisationSchedule: MonthlyAmortisationSchedule[]
    paymentSchedule: Repayments
}

type MonthlyAmortisationSchedule = {
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
        amortisationSchedule: [],
        paymentSchedule: {schedule:[]}
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

    const addRepayment = (month: number, amount: number) => {
        setEmiState((current: EmiState) => {
            const newState = { ...current }
            const newRepayments = current.paymentSchedule.schedule.map((value) => {
                return {
                    month: value.month,
                    amount: value.amount
                }
            })
            newState.paymentSchedule = {
                schedule: newRepayments
            }
            newState.paymentSchedule.schedule.push({ month, amount })
            console.log(JSON.stringify(newState))
            return newState
        })
    }

    const amortisationSchedule = () => {
        const monthlyAmortisation: MonthlyAmortisationSchedule[] = []
        let outstanding = emiState.totalLoan
        const disbursementsMap: Map<number, number> = new Map();
        const repaymentsMap: Map<number, number> = new Map();
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
        emiState.paymentSchedule.schedule.forEach((value: Repayment) => {
            if (repaymentsMap.has(value.month)) {
                let amt = repaymentsMap.get(value.month)
                amt = amt && amt > 0 ? amt : 0
                repaymentsMap.set(value.month,
                    amt + value.amount)
            } else {
                repaymentsMap.set(value.month, value.amount)
            }
        })
        if (disbursementsMap.size > 0){
            const firstDisburse = disbursementsMap.get(1)
            if (firstDisburse && firstDisburse > 0){
                outstanding = 0
            }
        }
        for (let i = 0; i < emiState.numberOfMonth; i++) {
            if (outstanding < 0) {
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
            monthlyAmortisation.push({
                outstanding: outstandingForMonth,
                interestDeducted: interestForMonth,
                principalDeducted: principalDeducted
            })
            let paymentDone = repaymentsMap.get(i+1)
            if (paymentDone && paymentDone > 0){
                outstanding = outstanding - paymentDone
            }
        }
       
        setEmiState((currentState: EmiState) => {
            const newState = { ...currentState }
            newState.calculated = true
            newState.amortisationSchedule = monthlyAmortisation
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

const showRepayments = <div style={{ display: 'flex', flexDirection: 'column', flex: 1, }}>
{
    emiState.paymentSchedule.schedule.map((value, index) => {
        console.log('Iterating disbursement:', index)
        return <AddRepayment key={`AddRepaymentOuterContainer${index}`} namePrfix={`AddRepaymentContainer${index}`}
            amount={value.amount} month={value.month} onSave={(month, amount) => {
                setEmiState((current: EmiState) => {
                    const newState = { ...current }
                    newState.paymentSchedule.schedule[index].amount = amount
                    newState.paymentSchedule.schedule[index].month = month
                    console.log('new state on save::', newState)
                    return newState
                })

            }} />
    })
}
</div>


    const tableData: TableData = {
        name: 'amortisationChart',
        cells: [{ cell: 'Month' }, { cell: 'Outstanding' }, { cell: 'Principal' }, { cell: 'Interest' }],
        body: []
    }

    let amortisationTable = <></>

    if (emiState.calculated === true) {
        emiState.amortisationSchedule.forEach((val: MonthlyAmortisationSchedule, index: number) => {
            tableData.body.push([{ data: index + 1 }, { data: val.outstanding }, { data: val.principalDeducted }, { data: val.interestDeducted }])
        })
        amortisationTable = <Table body={tableData.body} name={tableData.name} cells={tableData.cells} />
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
                <span>Add repayment schedule</span>
                <Button size="large" importance="primary" name="Add Repayment" onClick={() => {
                    addRepayment(0, 0)
                }} />
            </div>
            {showRepayments}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, }}>
            <div style={{ display: 'flex', flexDirection: 'row', flex: 1 }}>
                <Button size="large" importance="primary" name="Amortisation Schedule" onClick={() => {
                    amortisationSchedule()
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
                amortisationTable
            }
        </div>
    </div>)
}

export default EmiApp