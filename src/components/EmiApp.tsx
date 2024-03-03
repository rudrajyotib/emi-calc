import { Button, TextInput } from "rb-base-element"
import { useState } from "react"
import { AddDisbursement } from "./functional/AddDisbursement/AddDisbursement"

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
    monthlyBreakup : {principal: number, interest: number, pendingPrincipal: number}[],
    calculated:boolean,
    disbursements: Disbursements
}

const calculateEmi = (loanAmount: number, rateOfInterest: number, tenureInMonths: number ) =>{
    const monthlyRateOfInterest = rateOfInterest / 1200
    const emi : number = (loanAmount * monthlyRateOfInterest * Math.pow((1+monthlyRateOfInterest), (tenureInMonths)))/(Math.pow((1+monthlyRateOfInterest), tenureInMonths-1)-1)
    return emi
}


const EmiApp = () => {
    const [emiState, setEmiState] = useState<EmiState>({
        numberOfMonth:0,
        totalLoan: 0,
        interest: 0,
        emi: 0,
        monthlyBreakup: [],
        calculated: false,
        disbursements : {schedule:[]}
    })

    const addDisbursement = (month: number, amount: number) =>{
        setEmiState((current:EmiState)=>{
            const newState = {...current}
            const newDisbursements = current.disbursements.schedule.map((value)=>{
                return {
                    month: value.amount,
                    amount: value.amount
                }
            })
            newState.disbursements  = {
                schedule: newDisbursements
            }
            newState.disbursements.schedule.push({month, amount})
            console.log(JSON.stringify(newState))
            return newState
        })
    }

    return (<div style={{display:'flex', flexDirection:'column', flex:1, }}>
        <h1>Smart Emi Calculator</h1>
        <div style={{display:'flex', flexDirection:'column', flex:1}}>
            <div style={{display:'flex', flexDirection:'row', flex:1}}>
                <div style={{flex:1}}><span>Total loan amount</span></div>
                <div style={{flex:1}}><TextInput 
                    name="loanAmount"
                    onChangeHandler={(text:string)=>{
                        setEmiState((currentState: EmiState)=>{
                            const newState: EmiState = {...currentState}
                            newState.totalLoan = parseInt(text)
                            return newState
                        })
                    }} 
                    textType="numeric"
                    value="0"
                    placeHolderText=""/></div>
            </div>
            <div style={{display:'flex', flexDirection:'row', flex:1}}>
                <div style={{flex:1}}><span>Loan tenure (in years)</span></div>
                <div style={{flex:1}}><TextInput 
                    name="tenureInYears"
                    onChangeHandler={(text:string)=>{
                        setEmiState((currentState: EmiState)=>{
                            const newState: EmiState = {...currentState}
                            newState.numberOfMonth = parseInt(text) * 12
                            return newState
                        })
                    }} 
                    textType="numeric"
                    value="0"
                    placeHolderText=""/></div>
            </div>
            <div style={{display:'flex', flexDirection:'row', flex:1}}>
                <div style={{flex:1}}><span>Interest Rate %</span></div>
                <div style={{flex:1}}><TextInput 
                    name="loanAmount"
                    onChangeHandler={(text:string)=>{setEmiState((currentState: EmiState)=>{
                        const newState: EmiState = {...currentState}
                        newState.interest = parseFloat(text)
                        return newState
                    })}} 
                    textType="decimal-fraction"
                    value="0"
                    placeHolderText=""/></div>
            </div>
            <div>
                <Button size="large" name="calculate" importance="primary" onClick={()=>{
                    setEmiState((currentState: EmiState)=>{
                        const newState = {...currentState}
                        
                        newState.emi = calculateEmi(emiState.totalLoan, emiState.interest, emiState.numberOfMonth)
                        console.log('Emi is::', newState.emi)
                        return newState
                    })
                }}/>
            </div>
        </div>
        <div><hr/></div>
        <div style={{display:'flex', flexDirection:'column', flex:1, }}>
        <div style={{display:'flex', flexDirection:'row', flex:1}}>
            <span>Add disbursement schedule</span>
            <Button size="large" importance="primary" name="Add Disbursement" onClick={()=>{
                addDisbursement(0, 0)
            }}/>
        </div>
        <div style={{display:'flex', flexDirection:'column', flex:1, }}>
                {
                    emiState.disbursements.schedule.map((value, index)=>{
                        console.log('Iterating disbursement:',index)
                       return <AddDisbursement key={`AddDisbursementOuterContainer${index}`} namePrfix={`AddDisbursementContainer${index}`}
                            amount={value.amount} month={value.month} onSave={(month, amount)=>{
                                setEmiState((current:EmiState)=>{
                                    const newState = {...current}
                                    newState.disbursements.schedule[index].amount = amount
                                    newState.disbursements.schedule[index].month = month
                                    console.log('new state on save::', newState)
                                    return newState
                                })
                                
                            }}/>
                        })
                }
        </div>
        </div>
        <div>
            <span>Total Emi </span>
            <span>{}</span>
        </div>
    </div>)
}

export default EmiApp