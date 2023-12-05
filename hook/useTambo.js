import React, { useEffect, useState } from 'react';

function useTambo() {
    const [ tamboSel, guardarTamboSel] = useState(null);
    const [tambos, guardarTambos]= useState(null);
    return {tamboSel,
            guardarTamboSel,
            tambos, 
            guardarTambos
            };
}
export default useTambo;