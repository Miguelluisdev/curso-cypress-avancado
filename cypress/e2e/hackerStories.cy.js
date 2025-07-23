import { faker } from "@faker-js/faker";

describe("Hacker Stories", () => {
  const initialTerm = "React";
  const newTerm = "Cypress";

  beforeEach(() => {
    cy.intercept("GET", "**/search?query=React&page=0").as("getInitialStories");

    cy.visit("/");
    cy.wait("@getInitialStories");
  });

  it("shows the footer", () => {
    cy.get("footer")
      .should("be.visible")
      .and("contain", "Icons made by Freepik from www.flaticon.com");
  });

  context("List of stories", () => {
    it('shows 20 stories, then the next 20 after clicking "More"', () => {
      cy.get(".item").should("have.length", 20);
      cy.intercept({
        method: "GET",
        pathname: "**/search",
        query: {
          query: "React",
          page: "1",
        },
      }).as("getNextStories");
      cy.contains("More").click();
      cy.wait("@getNextStories");

      cy.get(".item").should("have.length", 40);
    });

    it("shows only nineteen stories after dismissing the first story", () => {
      cy.get(".button-small").first().click();
      cy.get(".item").should("have.length", 19);
    });
  });

  context("Search", () => {
    beforeEach(() => {
      cy.intercept("GET", `**/search?query=${newTerm}&page=0`).as(
        "searchStories"
      );
      cy.get("#search").clear();
    });

    it("types and hits ENTER", () => {
      cy.get("#search").type(`${newTerm}{enter}`);
      cy.wait("@searchStories");

      cy.get(".item").should("have.length", 20);
      cy.get(".item").first().should("contain", newTerm);
      cy.contains(`button`, initialTerm).should("be.visible");
    });

    it("types and clicks the submit button", () => {
      cy.get("#search").type(newTerm);
      cy.contains("Submit").click();
      cy.wait("@searchStories");

      cy.get(".item").should("have.length", 20);
      cy.get(".item").first().should("contain", newTerm);
      cy.contains(`button`, initialTerm).should("be.visible");
    });

    it("types and submits the form directly", () => {
      cy.get("#search").type(newTerm);
      cy.get("form").submit();
      cy.wait("@searchStories");

      cy.get(".item").should("have.length", 20);
    });

    context("Last searches", () => {
      it("searches via the last searched term", () => {
        cy.get("#search").type(`${newTerm}{enter}`);

        cy.contains(`button`, initialTerm).click();

        cy.get(".item").should("have.length", 20);
        cy.get(".item").first().should("contain", initialTerm);
        cy.contains(`button`, newTerm).should("be.visible");
      });

      it("shows a max of 5 buttons for the last searched terms with empty results", () => {
        cy.intercept("GET", "**/search**", {
          statusCode: 200,
          body: {
            hits: [],
          },
        }).as("getEmptyStories");

        Cypress._.times(6, () => {
          cy.get("#search").clear().type(`${faker.word.noun()}{enter}`);
          cy.wait("@getEmptyStories");
        });

        cy.get(".last-searches button").should("have.length", 5);
      });
    });
  });
});

context("Errors", () => {
  it('shows "Something went wrong ..." in case of a server error', () => {
    cy.intercept("GET", "**/search**", { statusCode: 500 }).as(
      "getServerError"
    );

    cy.visit("/");
    cy.wait("@getServerError");
    cy.get("p:contains(Something went wrong ...)")
      .should("be.visible")
      .and("contain", "Something went wrong ...");
  });

  it('shows "Something went wrong ..." in case of a network error', () => {
    cy.intercept("GET", "**/search**", { forceNetworkError: true }).as(
      "getNetworkError"
    );

    cy.visit("/");
    cy.wait("@getNetworkError");
    cy.get("p:contains(Something went wrong ...)")
      .should("be.visible")
      .and("contain", "Something went wrong ...");
  });

  context("Localstorage exercise", () => {
    beforeEach(() => {
      cy.visit("/");
    });
    it("deve salvar o último termo buscado no localStorage", () => {
      const termo = "Cypress";

      cy.get("#search").clear().type(`${termo}{enter}`);

      cy.getLocalStorage("search").should("be.equal", termo);
      cy.reload();
    });
  });

  it.only('shows a "Loading ..." state before showing the results', () => {
    cy.intercept("GET", "**/search?query=React&page=0", {
      delay: 1000 ,
      fixture:'stories20.json'
    }).as("getInitialStoriesDelayed");

    cy.visit("/");
    cy.assertLoadingIsShownAndHidden();
    cy.wait("@getInitialStoriesDelayed");

    cy.get(".item").should("have.length", 20);
  });
});
