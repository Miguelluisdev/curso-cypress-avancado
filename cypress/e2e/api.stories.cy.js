context("List of stories (isolated via fixture)", () => {
  beforeEach(() => {
    cy.visit("/");

    // Mock da primeira página de resultados (page 0)
    cy.intercept("GET", "**/search?query=React&page=0", {
      fixture: "stories20.json",
    }).as("getFirstPage");

    // Mock da segunda página (page 1) com os mesmos dados só para simular
    cy.intercept("GET", "**/search?query=React&page=1", {
      fixture: "stories20.json",
    }).as("getSecondPage");
  });

  it('shows 20 stories, then the next 20 after clicking "More"', () => {
    cy.wait("@getFirstPage");

    cy.get(".item").should("have.length", 20);

    cy.contains("More").click();

    cy.wait("@getSecondPage");

    cy.get(".item").should("have.length", 40);
  });
});

context("Search via last searched term (mocked)", () => {
  beforeEach(() => {
    cy.visit("/");

    cy.intercept("GET", "**/search?query=React&page=0", {
      fixture: "stories20.json",
    }).as("getFirstPage");

    cy.intercept("GET", "**/search?query=React&page=1", {
      fixture: "stories20.json",
    }).as("getSecondPage");
  });

  it("searches via the last searched term (mocked)", () => {
    const newTerm = "JavaScript";
    const initialTerm = "React";

    cy.intercept("GET", `**/search?query=${newTerm}&page=0`, {
      fixture: "stories20.json",
    }).as("getNewTerm");

    cy.intercept("GET", `**/search?query=${initialTerm}&page=0`, {
      fixture: "stories20.json",
    }).as("getInitialTerm");

    cy.get("#search").clear().type(`${newTerm}{enter}`);
    cy.wait("@getNewTerm");

    cy.contains("button", initialTerm).click();
    cy.wait("@getInitialTerm");

    cy.get(".item").should("have.length", 20);
    cy.get(".item").first().should("contain", "Story");
    cy.contains("button", newTerm).should("be.visible");
  });
});
