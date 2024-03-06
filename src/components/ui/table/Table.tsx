import { CellProp, HeaderProp, TableData } from "./TableProps";

const Table = (props: TableData) => {
    return (<div style={{display:'flex', flexDirection: 'column', flex: 1}}>
        <div style={{display:'flex', flexDirection: 'row', flex: 1, justifyContent: 'space-evenly'}}>
            {
                props.cells.map((header: HeaderProp, index: number)=>{
                    return (<div key={`TableHeader${props.name}${index}`}>
                        {header.cell}
                    </div>)
                })
            }
        </div>
        {
            props.body.map((row: CellProp[], index: number)=>{
                return (<div style={{display:'flex', flexDirection: 'row', flex: 1,  justifyContent: 'space-evenly'}} key={`TableRow${index}`}>
                    {
                        row.map((cellValue: CellProp, cellIndex: number)=>{
                            return(<div key={`TableCell${cellIndex}Row${index}`}>
                                {cellValue.data}
                            </div>)
                        })
                    }
                    
                </div>)
            })
        }
        
    </div>)
}

export default Table