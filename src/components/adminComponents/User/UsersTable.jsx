import React, { useState, useEffect, useRef } from 'react';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import ExcelJS from 'exceljs';
import saveAs from 'file-saver';

import { useUsers } from '../../../services/useUsers';

function UsersTable(props) {

    // --------------- Setup (Servicios, Contextos, Referencias) -----------------------------------

    const toast = useRef(null);
    const { users, error, isLoading, isValidating, refresh, patchObject } = useUsers(); // EDITABLE

    // --------------- Estados ---------------------------------------------------------------------

    const [filters, setFilters] = useState(null);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null); // Objeto seleccionado: EDITABLE

    // --------------- Funciones necesarias para persistencia ----------------------------------------

    useEffect(() => {
        const savedState = sessionStorage.getItem('user-table-state');

        if (savedState) {
            // Parse the saved state
            const parsedState = JSON.parse(savedState);

            // Check if filters are saved and set them
            if (parsedState.filters) {
                setFilters(parsedState.filters);

                // If global filter is set, update globalFilterValue
                if (parsedState.filters.global && parsedState.filters.global.value) {
                    setGlobalFilterValue(parsedState.filters.global.value);
                }
            }
        } else {
            // Initialize with default filters if no saved state
            initFilters();
        }
    }, []); // ESPECIFICO

    // --------------- Funciones especificas del componente ------------------------------------------
    
    useEffect(() => {
        if (error) {
            toast.current.show({
                severity: 'info',
                summary: 'Aviso',
                detail: 'Hubo un problema con el servidor, intenta más tarde',
                life: 3000,
            });
        }
    }, [error]); // Genera el toast con el error: GENERAL
    const refreshData = () => {
        setIsRefreshing(true);
        refresh();
    }; // Refresca los datos: GENERAL
    useEffect(() => {
        if (isRefreshing) {
            setIsRefreshing(false);
        }
    }, [isValidating]); // Cambia el estado de refreshing: GENERAL
    const clearFilter = () => {
        initFilters();
    }; // Función para limpiar todos los filtros: GENERAL
    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };

        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    }; // Función para el filtro global: GENERAL
    const initFilters = () => {
        setFilters({
            global: { value: null, matchMode: FilterMatchMode.CONTAINS },
            id: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            ciudad: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            lastname: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            email: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            cellphone: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        }); // EDITABLE
        setGlobalFilterValue('');
    }; // Función para restaurar e inicializar los filtros: ESPECIFICO
    const cols = [
        { header: 'ID', dataKey: 'id' },
        { header: 'Ciudad', dataKey: 'ciudad' },
        { header: 'Nombre', dataKey: 'name' },
        { header: 'Apellido', dataKey: 'lastname' },
        { header: 'E-mail', dataKey: 'email' },
        { header: 'Teléfono', dataKey: 'cellphone' },
    ]; // Columnas que se expotarán en el PDF: ESPECIFICO
    const exportPdf = () => {
        import('jspdf').then((jsPDF) => {
            import('jspdf-autotable').then(() => {
                const doc = new jsPDF.default(0, 0);

                doc.autoTable({
                    head: [cols.map((column) => column.header)],
                    body: users.map((row) => cols.map((column) => row[column.dataKey])), // EDITABLE
                });

                doc.save('Usuarios.pdf'); // EDITABLE
            });
        });
    }; // Función para exportar a PDF: ESPECIFICO
    const exportExcel = () => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Usuarios'); // EDITABLE

        const headerRow = [];
        cols.forEach((col) => {
            headerRow.push(col.header);
        });
        worksheet.addRow(headerRow);

        users.forEach((user) => { //EDITABLE
            worksheet.addRow([
                user.id,
                user.ciudad,
                user.name,
                user.lastname,
                user.email,
                user.cellphone,
            ]);
        }); // EDITABLE

        workbook.xlsx.writeBuffer().then((buffer) => {
            saveAsExcelFile(buffer, 'Usuarios'); // EDITABLE
        });
    }; // Función para exportar a Excel: ESPECIFICO
    const saveAsExcelFile = (buffer, fileName) => {
        let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        let EXCEL_EXTENSION = '.xlsx';
        const data = new Blob([buffer], {
            type: EXCEL_TYPE
        });

        const currentDate = new Date();
        const formattedDate = currentDate.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
        saveAs(data, fileName + ' - ' + formattedDate + EXCEL_EXTENSION);
    }; // Función para guardar el Excel: GENERAL
    const renderHeader = () => {
        return (
            <div className="flex justify-content-between">
                <div className="table-utility">
                    <span className="search-input-container">
                        <i className="pi pi-search search-input-icon" style={{ fontSize: '0.8rem', margin: '0' }}></i>
                        <InputText className="search-input" value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Buscar" />
                    </span>
                    <Button className="rounded-icon-btn" onClick={refreshData}>
                        <i className="pi pi-refresh" style={{ fontSize: '0.8rem', margin: '0' }}></i>
                    </Button>
                    <Button onClick={clearFilter} className="rounded-icon-btn" type="button" rounded>
                        <i className="pi pi-filter-slash" style={{ fontSize: '0.8rem', margin: '0' }}></i>
                    </Button>
                </div>
                <div className="table-utility">
                    <Button onClick={exportExcel} id="dwn-excel" className="rounded-icon-btn" type="button" rounded data-pr-tooltip="XLS">
                        <i className="pi pi-file-excel" style={{ fontSize: '0.8rem', margin: '0' }}></i>
                    </Button>
                    <Button onClick={exportPdf} id="dwn-pdf" className="rounded-icon-btn" type="button" rounded data-pr-tooltip="PDF">
                        <i className="pi pi-file-pdf" style={{ fontSize: '0.8rem', margin: '0' }}></i>
                    </Button>
                </div>
            </div>
        );
    }; // Contiene el header de la tabla: GENERAL
    const filterClearTemplate = (options) => {
        return <Button id="cancel" className="rounded-icon-btn" type="button" onClick={options.filterClearCallback}>
            <i className="pi pi-times" style={{ fontSize: '0.8rem', margin: '0' }}></i>
        </Button>;
    }; // Formato del botón para cancelar filtros: GENERAL
    const filterApplyTemplate = (options) => {
        return <Button className="rounded-icon-btn" type="button" onClick={options.filterApplyCallback}>
            <i className="pi pi-check" style={{ fontSize: '0.8rem', margin: '0' }}></i>
        </Button>;
    }; // Formato del botón para confirmar filtros: GENERAL
    const header = renderHeader(); // Renderizar el header: GENERAL
    const columnsData = [
        {
            nombrevar: "id",
            header: "Código",
            filterPlaceholder: "Buscar por código",
        },
        {
            nombrevar: "role",
            header: "Rol",
            filterPlaceholder: "Buscar por rol",
        },
        {
            nombrevar: "ciudad",
            header: "Ciudad",
            filterPlaceholder: "Buscar por ciudad",
        },
        {
            nombrevar: "name",
            header: "Nombre",
            filterPlaceholder: "Buscar por nombre",
        },
        {
            nombrevar: "lastname",
            header: "Apellido",
            filterPlaceholder: "Buscar por apellido",
        },
        {
            nombrevar: "email",
            header: "E-mail",
            filterPlaceholder: "Buscar por e-mail",
        },
        {
            nombrevar: "cellphone",
            header: "Teléfono",
            filterPlaceholder: "Buscar por teléfono",
        }
    ]; // Contiene los parámetros para crear columnas: ESPECIFICO

    // ------------------------------ Editor de filas -----------------------------------

    const textEditor = (options) => {
        return <InputText 
        style={{
            maxHeight: '80%', 
            maxWidth: '100%', 
            padding: '5px', 
            fontSize: '12px'
        }} 
        type="text" value={options.value} onChange={(e) => options.editorCallback(e.target.value)} />;
    };

    const onCellEditComplete = async (e) => {
        let { rowData, newValue, field, originalEvent: event } = e;
        const newUser = {
            role: newValue
        }

        try {
            const response = await patchObject(rowData.id, newUser);
            if (response === 201) {
                toast.current.show({
                    severity: 'success',
                    summary: 'Éxito',
                    detail: 'Se editó el registro con éxito',
                    life: 3000,
                });
                resetStates();
            }
        } catch (error) {
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Ocurrió un error',
                life: 3000,
            });
        }
    };

    
    return (
        <div className="table">
            <Toast ref={toast} />
            {(isLoading || (isRefreshing && isValidating)) &&
                <div className="spinnercontainer">
                    <div className="spinnercontainer__spinner" />
                </div>
            }
            {error &&
                <div className="stale-data-msg">
                    <i className="pi pi-exclamation-circle" style={{ fontSize: '0.8rem', margin: '0', color: 'white' }}></i>
                    <span><strong>Los datos pueden estar desactualizados</strong> | intenta recargar la tabla</span>
                </div>}
            <DataTable
                editMode="cell"
                dataKey="id"
                value={users} // EDITABLE
                resizableColumns
                removableSort
                paginator
                scrollable
                scrollHeight="70vh"
                showGridlines
                rows={25}
                rowsPerPageOptions={[5, 10, 25, 50]}
                size="small"
                filters={filters}
                globalFilterFields={['id', 'name', 'lastname', 'ciudad', 'email', 'cellphone']} // EDITABLE
                header={header}
                emptyMessage="No se encontraron usuarios" // EDITABLE
                selectionMode="single"
                metaKeySelection={false}
                stateStorage="session" 
                stateKey="user-table-state" // EDITABLE
            >
                {columnsData.map((column, index) => (
                    column.nombrevar === "role" ? (
                        <Column
                            key={index}
                            field={column.nombrevar}
                            header={column.header}
                            sortable
                            filter
                            filterField={column.nombrevar}
                            filterPlaceholder={column.filterPlaceholder}
                            filterClear={filterClearTemplate}
                            filterApply={filterApplyTemplate}
                            editor={(options) => textEditor(options)}
                            onCellEditComplete={onCellEditComplete}
                        />
                    ) : (
                        <Column
                            key={index}
                            field={column.nombrevar}
                            header={column.header}
                            sortable
                            filter
                            filterField={column.nombrevar}
                            filterPlaceholder={column.filterPlaceholder}
                            filterClear={filterClearTemplate}
                            filterApply={filterApplyTemplate}
                        />
                    )
                ))}
            </DataTable>
        </div>
    );
}

export default UsersTable;