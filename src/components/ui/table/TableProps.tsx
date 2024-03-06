type CellProp = {
    data: string | number
}

type HeaderProp = {
    cell: string
}

type TableData = {
    cells: HeaderProp[]
    body : CellProp[][]
    name: string
}

export type {CellProp, HeaderProp, TableData}