import { faker } from "@faker-js/faker";

describe("Hacker Stories", () => {
  const initialTerm = "React";
  const newTerm = "Cypress";

  beforeEach(() => {
    cy.visit("/");
    cy.intercept({
      method: "GET",
      pathname: "**/search",
      query: {
        query: "React",
        page: "0",
      },
    }).as("getStories");
  });

  it("shows the footer", () => {
    cy.get("footer")
      .should("be.visible")
      .and("contain", "Icons made by Freepik from www.flaticon.com");
  });

  context("List of stories", () => {
    it('shows 20 stories, then the next 20 after clicking "More"', () => {
      cy.get(".item").should("have.length", 20);

      cy.contains("More").click();
      cy.assertLoadingIsShownAndHidden();

      cy.get(".item").should("have.length", 40);
    });

    it("shows only nineteen stories after dismissing the first story", () => {
      cy.get(".button-small").first().click();
      cy.get(".item").should("have.length", 19);
    });
  });

  context("Search", () => {
    beforeEach(() => {
      cy.get("#search").clear();
    });

    it("types and hits ENTER", () => {
      cy.get("#search").type(`${newTerm}{enter}`);
      cy.assertLoadingIsShownAndHidden();

      cy.get(".item").should("have.length", 20);
      cy.get(".item").first().should("contain", newTerm);
      cy.contains(`button`, initialTerm).should("be.visible");
    });

    it("types and clicks the submit button", () => {
      cy.get("#search").type(newTerm);
      cy.contains("Submit").click();
      cy.assertLoadingIsShownAndHidden();

      cy.get(".item").should("have.length", 20);
      cy.get(".item").first().should("contain", newTerm);
      cy.contains(`button`, initialTerm).should("be.visible");
    });

    context("Last searches", () => {
      it("searches via the last searched term", () => {
        cy.get("#search").type(`${newTerm}{enter}`);
        cy.assertLoadingIsShownAndHidden();

        cy.contains(`button`, initialTerm).click();
        cy.assertLoadingIsShownAndHidden();

        cy.get(".item").should("have.length", 20);
        cy.get(".item").first().should("contain", initialTerm);
        cy.contains(`button`, newTerm).should("be.visible");
      });

      it("shows a max of 5 buttons for the last searched terms", () => {
        Cypress._.times(6, () => {
          cy.get("#search").clear().type(`${faker.word.noun()}{enter}`);
          cy.assertLoadingIsShownAndHidden();
        });

        cy.get(".last-searches button").should("have.length", 5);
      });
    });
  });
});
