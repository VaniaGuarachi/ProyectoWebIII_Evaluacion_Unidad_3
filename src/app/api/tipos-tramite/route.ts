import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function GET() {
  try {
    // 1. Obtener tipos de trámite
    const [tipos]: any = await pool.query(`
      SELECT 
        id_tipo_tramite as id, 
        nombre, 
        descripcion, 
        costo_base as price, 
        requiere_pago, 
        requiere_solvencia 
      FROM univalle_tramites.tipos_tramite 
      WHERE estado = 'ACTIVO'
    `);

    // 2. Obtener requisitos para cada tipo
    const [requisitos]: any = await pool.query(`
      SELECT id_tipo_tramite, nombre as nombre_requisito
      FROM univalle_tramites.requisitos_tramite
    `);

    // 3. Mapear requisitos a los tipos
    const result = tipos.map((t: any) => ({
      ...t,
      requires: requisitos
        .filter((r: any) => r.id_tipo_tramite === t.id)
        .map((r: any) => r.nombre_requisito)
    }));

    return NextResponse.json(result);

  } catch (error: any) {
    console.error("Error en tipos-tramite API completa:", error);
    return NextResponse.json(
      { error: "Error al obtener tipos de trámite." },
      { status: 500 }
    );
  }
}
