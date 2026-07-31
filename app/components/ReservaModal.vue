<template>
  <div class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
      <!-- Overlay -->
      <div class="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" @click="$emit('close')"></div>

      <!-- Modal -->
      <div class="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
        <div class="bg-white px-6 pt-6 pb-4">
          <!-- Header -->
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-xl font-semibold text-gray-900">
              {{ reserva ? 'Editar Reserva' : 'Nueva Reserva' }}
            </h3>
            <button @click="$emit('close')" class="text-gray-400 hover:text-gray-500">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Form -->
          <form @submit.prevent="guardarReserva" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Cliente -->
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-1">Cliente *</label>
                <input
                  v-model="form.cliente_nombre"
                  type="text"
                  required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Nombre del cliente"
                />
              </div>

              <!-- Fecha -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Fecha *</label>
                <input
                  v-model="form.fecha_reserva"
                  type="date"
                  required
                  min="2024-01-01"
                  @change="verificarDisponibilidad"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <!-- Hora Inicio -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Hora Inicio *</label>
                <select
                  v-model="form.hora_inicio"
                  required
                  @change="verificarDisponibilidad"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="">Seleccionar hora</option>
                  <option v-for="hora in horasDisponibles" :key="hora" :value="hora">
                    {{ formatHora(hora) }}
                  </option>
                </select>
                <p class="text-xs text-gray-500 mt-1">Solo horas exactas (ej: 7:00, 8:00, 9:00...)</p>
              </div>

              <!-- Hora Fin -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Hora Fin *</label>
                <select
                  v-model="form.hora_fin"
                  required
                  @change="verificarDisponibilidad"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="">Seleccionar hora</option>
                  <option v-for="hora in horasDisponibles" :key="hora" :value="hora">
                    {{ formatHora(hora) }}
                  </option>
                </select>
                <p class="text-xs text-gray-500 mt-1">Debe ser mayor a la hora de inicio</p>
              </div>

              <!-- Monto Total -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Monto Total *</label>
                <input
                  v-model.number="form.monto_total"
                  type="number"
                  step="0.01"
                  min="0.01"
                  required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>

              <!-- Monto Pagado -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Monto Pagado</label>
                <input
                  v-model.number="form.monto_pagado"
                  type="number"
                  step="0.01"
                  min="0"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="0.00"
                />
                <p class="text-xs text-gray-500 mt-1">No puede ser mayor al monto total</p>
              </div>

              <!-- Tipo Pago -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Tipo de Pago *</label>
                <select
                  v-model="form.tipo_pago"
                  required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="efectivo">Efectivo</option>
                  <option value="tarjeta">Tarjeta</option>
                  <option value="transferencia">Transferencia</option>
                  <option value="otro">Otro</option>
                </select>
              </div>

              <!-- Estado Pago -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Estado de Pago *</label>
                <select
                  v-model="form.estado_pago"
                  required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="pendiente">Pendiente</option>
                  <option value="pagado">Pagado</option>
                  <option value="parcial">Parcial</option>
                </select>
              </div>

              <!-- Observaciones -->
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-1">Observaciones</label>
                <textarea
                  v-model="form.observaciones"
                  rows="3"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Notas adicionales..."
                ></textarea>
              </div>
            </div>

            <!-- Mensaje de disponibilidad -->
            <div v-if="disponibilidadMensaje" 
                 :class="disponibilidadMensaje.tipo === 'error' ? 'bg-red-50 border-red-200 text-red-700' : 'bg-green-50 border-green-200 text-green-700'"
                 class="border px-4 py-3 rounded-lg text-sm">
              <div class="flex items-start gap-2">
                <svg v-if="disponibilidadMensaje.tipo === 'error'" class="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <svg v-else class="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p class="font-medium">{{ disponibilidadMensaje.titulo }}</p>
                  <p>{{ disponibilidadMensaje.texto }}</p>
                </div>
              </div>
            </div>

            <!-- Mensajes de error -->
            <div v-if="errorMessage" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              <div class="flex items-start gap-2">
                <svg class="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p class="font-medium">Error:</p>
                  <p>{{ errorMessage }}</p>
                </div>
              </div>
            </div>

            <!-- Mensajes de advertencia -->
            <div v-if="warningMessage" class="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg text-sm">
              <div class="flex items-start gap-2">
                <svg class="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div>
                  <p class="font-medium">Aviso:</p>
                  <p>{{ warningMessage }}</p>
                </div>
              </div>
            </div>

            <!-- Botones -->
            <div class="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                @click="$emit('close')"
                class="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                :disabled="cargando || !disponible"
                class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span v-if="!cargando">{{ reserva ? 'Actualizar' : 'Guardar' }}</span>
                <span v-else class="flex items-center gap-2">
                  <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Guardando...
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const supabase = useSupabaseClient()

const props = defineProps({
  reserva: {
    type: Object,
    default: null
  },
  horaInicio: {
    type: String,
    default: null
  },
  fechaSeleccionada: {
    type: String,
    default: null
  }
})

const emit = defineEmits(['close', 'save'])

const cargando = ref(false)
const errorMessage = ref('')
const warningMessage = ref('')
const disponible = ref(true)
const disponibilidadMensaje = ref(null)

// Generar horas disponibles (de 7:00 a 22:00, solo horas exactas)
const horasDisponibles = computed(() => {
  const horas = []
  for (let i = 6; i <= 23; i++) {
    horas.push(`${i.toString().padStart(2, '0')}:00`)
  }
  return horas
})

// Formatear hora para mostrar
const formatHora = (hora) => {
  if (!hora) return ''
  const [h, m] = hora.split(':')
  const horaNum = parseInt(h)
  const ampm = horaNum >= 12 ? 'PM' : 'AM'
  const hora12 = horaNum > 12 ? horaNum - 12 : horaNum
  return `${hora12}:${m} ${ampm}`
}

// Estado del formulario
const form = reactive({
  cliente_nombre: '',
  fecha_reserva: new Date().toISOString().split('T')[0],
  hora_inicio: '',
  hora_fin: '',
  monto_total: 0,
  monto_pagado: 0,
  tipo_pago: 'efectivo',
  estado_pago: 'pendiente',
  observaciones: '',
  administrador_id: null
})

// Verificar disponibilidad
const verificarDisponibilidad = async () => {
  // Limpiar mensaje anterior
  disponibilidadMensaje.value = null
  disponible.value = true
  
  // Validar que tengamos los datos necesarios
  if (!form.fecha_reserva || !form.hora_inicio || !form.hora_fin) {
    return
  }
  
  // Validar que hora fin sea mayor a hora inicio
  if (form.hora_inicio >= form.hora_fin) {
    disponibilidadMensaje.value = {
      tipo: 'error',
      titulo: '⚠️ Horario inválido',
      texto: 'La hora de fin debe ser mayor a la hora de inicio'
    }
    disponible.value = false
    return
  }
  
  try {
    // Construir la consulta
    let query = supabase
      .from('reservas')
      .select('id, cliente_nombre, hora_inicio, hora_fin')
      .eq('fecha_reserva', form.fecha_reserva)
    
    // Si estamos editando, excluir la reserva actual
    if (props.reserva && props.reserva.id) {
      query = query.neq('id', props.reserva.id)
    }
    
    const { data, error } = await query
    
    if (error) {
      console.error('Error verificando disponibilidad:', error)
      return
    }
    
    if (data && data.length > 0) {
      // Verificar conflicto de horarios
      const horaInicio = form.hora_inicio
      const horaFin = form.hora_fin
      
      const conflicto = data.some(reserva => {
        const reservaInicio = reserva.hora_inicio.substring(0, 5)
        const reservaFin = reserva.hora_fin.substring(0, 5)
        
        // Verificar si hay solapamiento
        // Caso 1: Nueva reserva empieza dentro de una existente
        // Caso 2: Nueva reserva termina dentro de una existente
        // Caso 3: Nueva reserva contiene a una existente
        const solapa = (horaInicio >= reservaInicio && horaInicio < reservaFin) ||
                      (horaFin > reservaInicio && horaFin <= reservaFin) ||
                      (horaInicio <= reservaInicio && horaFin >= reservaFin)
        
        return solapa
      })
      
      if (conflicto) {
        const reservaConflicto = data.find(r => {
          const rInicio = r.hora_inicio.substring(0, 5)
          const rFin = r.hora_fin.substring(0, 5)
          return (horaInicio >= rInicio && horaInicio < rFin) ||
                 (horaFin > rInicio && horaFin <= rFin) ||
                 (horaInicio <= rInicio && horaFin >= rFin)
        })
        
        disponibilidadMensaje.value = {
          tipo: 'error',
          titulo: '❌ Horario no disponible',
          texto: `El horario de ${formatHora(horaInicio)} a ${formatHora(horaFin)} ya está reservado por "${reservaConflicto?.cliente_nombre || 'otro cliente'}"`
        }
        disponible.value = false
      } else {
        disponibilidadMensaje.value = {
          tipo: 'success',
          titulo: '✅ Horario disponible',
          texto: `El horario de ${formatHora(horaInicio)} a ${formatHora(horaFin)} está libre`
        }
        disponible.value = true
      }
    } else {
      disponibilidadMensaje.value = {
        tipo: 'success',
        titulo: '✅ Horario disponible',
        texto: `El horario de ${formatHora(horaInicio)} a ${formatHora(horaFin)} está libre`
      }
      disponible.value = true
    }
  } catch (error) {
    console.error('Error verificando disponibilidad:', error)
  }
}

// Obtener administrador_id
const obtenerAdministradorId = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (user) {
      const { data, error } = await supabase
        .from('usuarios')
        .select('id')
        .eq('usuario', user.email)
        .single()
      
      if (data && !error) {
        return data.id
      }
    }
    
    const { data, error } = await supabase
      .from('usuarios')
      .select('id')
      .limit(1)
      .single()
    
    if (data && !error) {
      return data.id
    }
    
    return 1
  } catch (error) {
    console.error('Error obteniendo administrador_id:', error)
    return 1
  }
}

// Inicializar
onMounted(async () => {
  form.administrador_id = await obtenerAdministradorId()
  
  // Si viene del calendario con hora y fecha predefinida
  if (props.fechaSeleccionada) {
    form.fecha_reserva = props.fechaSeleccionada
  }
  
  if (props.horaInicio) {
    form.hora_inicio = props.horaInicio
    // Auto-asignar hora fin 1 hora después
    const horaNum = parseInt(props.horaInicio.split(':')[0])
    const horaFin = (horaNum + 1).toString().padStart(2, '0') + ':00'
    if (horaFin <= '23:00') {
      form.hora_fin = horaFin
    } else {
      form.hora_fin = '23:00'
    }
  }
  
  if (props.reserva) {
    Object.assign(form, {
      cliente_nombre: props.reserva.cliente_nombre || '',
      fecha_reserva: props.reserva.fecha_reserva?.split('T')[0] || form.fecha_reserva,
      hora_inicio: props.reserva.hora_inicio?.substring(0, 5) || form.hora_inicio,
      hora_fin: props.reserva.hora_fin?.substring(0, 5) || form.hora_fin,
      monto_total: Number(props.reserva.monto_total) || 0,
      monto_pagado: Number(props.reserva.monto_pagado) || 0,
      tipo_pago: props.reserva.tipo_pago || 'efectivo',
      estado_pago: props.reserva.estado_pago || 'pendiente',
      observaciones: props.reserva.observaciones || '',
      administrador_id: props.reserva.administrador_id || form.administrador_id
    })
  }
  
  // Verificar disponibilidad después de cargar datos
  await verificarDisponibilidad()
})


// Verificar disponibilidad cuando cambien fecha u horas
watch([() => form.fecha_reserva, () => form.hora_inicio, () => form.hora_fin], 
  async () => {
    await verificarDisponibilidad()
  }
)

// Validar antes de guardar
const validarFormulario = () => {
  errorMessage.value = ''
  warningMessage.value = ''
  
  // Validar cliente
  if (!form.cliente_nombre.trim()) {
    errorMessage.value = 'El nombre del cliente es obligatorio'
    return false
  }
  
  // Validar fecha
  if (!form.fecha_reserva) {
    errorMessage.value = 'La fecha de reserva es obligatoria'
    return false
  }
  
  // Validar hora de inicio
  if (!form.hora_inicio) {
    errorMessage.value = 'La hora de inicio es obligatoria'
    return false
  }
  
  // Validar hora de fin
  if (!form.hora_fin) {
    errorMessage.value = 'La hora de fin es obligatoria'
    return false
  }
  
  // Validar que hora fin sea mayor a hora inicio
  if (form.hora_inicio >= form.hora_fin) {
    errorMessage.value = 'La hora de fin debe ser mayor a la hora de inicio'
    return false
  }
  
  // Validar monto total
  if (form.monto_total <= 0) {
    errorMessage.value = 'El monto total debe ser mayor a 0'
    return false
  }
  
  // Validar que monto pagado no sea mayor al total
  if (form.monto_pagado > form.monto_total) {
    errorMessage.value = 'El monto pagado no puede ser mayor al monto total'
    return false
  }
  
  // Validar disponibilidad
  if (!disponible.value) {
    errorMessage.value = 'El horario seleccionado no está disponible'
    return false
  }
  
  // Advertencias (no bloqueantes)
  if (form.estado_pago === 'pagado' && form.monto_pagado < form.monto_total) {
    warningMessage.value = '⚠️ El estado es "Pagado" pero el monto pagado es menor al total. ¿Deseas continuar?'
    return true
  }
  
  if (form.estado_pago !== 'pagado' && form.monto_pagado >= form.monto_total) {
    warningMessage.value = '⚠️ El monto pagado es igual o mayor al total pero el estado no es "Pagado". ¿Deseas continuar?'
    return true
  }
  
  return true
}

const guardarReserva = async () => {
  cargando.value = true
  errorMessage.value = ''
  warningMessage.value = ''
  
  try {
    // 1. Validar formulario
    const esValido = validarFormulario()
    if (!esValido) {
      cargando.value = false
      return
    }
    
    // 2. Verificar disponibilidad nuevamente (por si acaso)
    await verificarDisponibilidad()
    if (!disponible.value) {
      errorMessage.value = 'El horario seleccionado no está disponible'
      cargando.value = false
      return
    }
    
    // 3. Si hay advertencia, preguntar al usuario
    if (warningMessage.value) {
      cargando.value = false
      
      const continuar = confirm(`${warningMessage.value}\n\n¿Deseas continuar de todas formas?`)
      
      if (!continuar) {
        warningMessage.value = ''
        return
      }
      
      warningMessage.value = ''
      cargando.value = true
    }
    
    // 4. Asegurar administrador_id
    if (!form.administrador_id) {
      form.administrador_id = await obtenerAdministradorId()
    }
    
    // 5. Preparar datos
    const dataToSave = {
      cliente_nombre: form.cliente_nombre.trim(),
      fecha_reserva: form.fecha_reserva,
      hora_inicio: form.hora_inicio + ':00',
      hora_fin: form.hora_fin + ':00',
      monto_total: Number(form.monto_total),
      monto_pagado: Number(form.monto_pagado || 0),
      tipo_pago: form.tipo_pago,
      estado_pago: form.estado_pago,
      observaciones: form.observaciones?.trim() || null,
      administrador_id: Number(form.administrador_id)
    }
    
    console.log('Datos a guardar:', dataToSave)
    
    // 6. Guardar en Supabase
    let result
    
    if (props.reserva) {
      result = await supabase
        .from('reservas')
        .update(dataToSave)
        .eq('id', props.reserva.id)
        .select()
    } else {
      result = await supabase
        .from('reservas')
        .insert([dataToSave])
        .select()
    }
    
    if (result.error) {
      console.error('Error de Supabase:', result.error)
      errorMessage.value = `Error: ${result.error.message}`
      cargando.value = false
      return
    }
    
    // 7. Éxito
    cargando.value = false
    emit('save')
    
  } catch (error) {
    console.error('Error guardando reserva:', error)
    errorMessage.value = error.message || 'Error al guardar la reserva'
    cargando.value = false
  }
}
</script>