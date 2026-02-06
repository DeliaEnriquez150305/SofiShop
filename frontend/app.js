fetch('http://localhost:3000/api/products')
  .then(res => res.json())
  .then(data => {
    const div = document.getElementById('productos');
    data.forEach(p => {
      div.innerHTML += `<p>${p.nombre} - $${p.precio}</p>`;
    });
  });
