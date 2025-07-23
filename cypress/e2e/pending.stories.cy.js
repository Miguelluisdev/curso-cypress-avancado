describe("", () => {
  beforeEach(() => {
    cy.intercept("GET", "**/search?query=React&page=0").as("getInitialStories");

    cy.visit("/");
    cy.wait("@getInitialStories");
  });

  it("shows the right data for all rendered stories", () => {
    cy.intercept("GET", "**/search**").as("getStories");
    cy.visit("/");
    cy.wait("@getStories");

    cy.get(".item").each(($el) => {
      cy.wrap($el).within(() => {
        cy.get("a").should("have.attr", "href").and("not.be.empty");
        cy.get("span").eq(0).should("not.be.empty");
      });
    });
  });

  it("shows no story when none is returned", () => {
    cy.intercept("GET", "**/search**", {
      statusCode: 200,
      body: {
        hits: [],
      },
    }).as("getNoStories");

    cy.visit("/");
    cy.wait("@getNoStories");

    cy.get(".item").should("not.exist");
  });
});

// .list-butonn:contains("More") ajuda para sites com seletores ruims
