// cy.intercept('GET', '/api/usuarios').as('getUsuarios');

// // Executa a ação que dispara a requisição
// cy.get('[data-testid="carregar-usuarios"]').click();

// // Espera a resposta da API
// cy.wait('@getUsuarios').then((intercept) => {
//   expect(intercept.response.statusCode).to.eq(200);
// });

// cy.intercept('GET', '/api/usuarios', {
//   statusCode: 200,
//   body: [
//     { id: 1, nome: 'Miguel QA' },
//     { id: 2, nome: 'Joana Tester' }
//   ]
// }).as('mockUsuarios');

// cy.get('[data-testid="carregar-usuarios"]').click();
// cy.wait('@mockUsuarios');


