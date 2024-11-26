// utils/ExpenseModal.js

// Funciones para abrir y cerrar el modal
function openModal() {
    document.getElementById('addExpenseModal').classList.remove('hidden');
}

function closeModal() {
    document.getElementById('addExpenseModal').classList.add('hidden');
}

// Lógica de envío de formulario
document.getElementById('expenseForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const expenseData = {
        amount: parseFloat(formData.get('amount')),
        category: formData.get('category'),
        description: formData.get('description')
    };

    // Enviar datos al backend
    const response = await fetch('/dashboard/api/add-expense', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(expenseData)
    });

    if (response.ok) {
        alert('Gasto agregado exitosamente');
        closeModal();
        e.target.reset();
        // Aquí puedes actualizar la gráfica o los datos en el dashboard
    } else {
        alert('Error al agregar el gasto');
    }
});
