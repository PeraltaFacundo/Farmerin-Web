import React, { useEffect, useState } from 'react';

function useExcel() {
    const [ archivoExcel, guardarArchivoExcel] = useState([]);
    return {archivoExcel,
            guardarArchivoExcel
            };
}
export default useExcel;