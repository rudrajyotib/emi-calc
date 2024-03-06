import { Button, TextInput } from "rb-base-element"
import { useState } from "react"

type LoanPlanProps = {
    onCalculate : (amount: number, tenureInMonths: number, interest: number) => void
}

type LoanPlanState = {
    loanAmount: number,
    loanTeureInYears: number,
    interest: number
}

const AddLoanPlan = (props: LoanPlanProps) => {

    const [loanPlan, setLoanPlan] = useState<LoanPlanState>({
        loanAmount:0,
        loanTeureInYears: 0,
        interest: 0
    })

    return ( <div style={{display:'flex', flexDirection:'column', flex:1}}>
    <div style={{display:'flex', flexDirection:'row', flex:1}}>
        <div style={{flex:1}}><span>Total loan amount</span></div>
        <div style={{flex:1}}><TextInput 
            name="loanAmount"
            onChangeHandler={(text:string)=>{
                setLoanPlan((currentState: LoanPlanState)=>{
                    const newState: LoanPlanState = {...currentState}
                    newState.loanAmount = parseInt(text)
                    return newState
                })
            }} 
            textType="numeric"
            value={loanPlan.loanAmount.toString()}
            placeHolderText=""/></div>
    </div>
    <div style={{display:'flex', flexDirection:'row', flex:1}}>
        <div style={{flex:1}}><span>Loan tenure (in years)</span></div>
        <div style={{flex:1}}><TextInput 
            name="tenureInYears"
            onChangeHandler={(text:string)=>{
                setLoanPlan((currentState: LoanPlanState)=>{
                    const newState: LoanPlanState = {...currentState}
                    newState.loanTeureInYears = parseInt(text) 
                    return newState
                })
            }} 
            textType="numeric"
            value={loanPlan.loanTeureInYears.toString()}
            placeHolderText=""/></div>
    </div>
    <div style={{display:'flex', flexDirection:'row', flex:1}}>
        <div style={{flex:1}}><span>Interest Rate %</span></div>
        <div style={{flex:1}}><TextInput 
            name="interestRate"
            onChangeHandler={(text:string)=>{setLoanPlan((currentState: LoanPlanState)=>{
                const newState: LoanPlanState = {...currentState}
                newState.interest = parseFloat(text)
                return newState
            })}} 
            textType="decimal-fraction"
            value={loanPlan.interest.toString()}
            placeHolderText=""/></div>
    </div>
    <div>
        <Button size="large" name="calculate" importance="primary" onClick={()=>{
            if (loanPlan.interest > 0 && loanPlan.loanAmount > 0 && loanPlan.loanTeureInYears > 0){
                props.onCalculate(loanPlan.loanAmount, loanPlan.loanTeureInYears*12, loanPlan.interest)
            }
        }}/>
    </div>
</div>)
}

export { AddLoanPlan }
export type { LoanPlanState }
