import React, { useState } from 'react';

function usePorcentaje() {
    const [ porc, setPorc] = useState(0);
    return {porc,
            setPorc
            };
}
export default usePorcentaje;