#### CODE REVIEW - TASK 1

The 'okreads' app allows you to search for books and add them to your reading list.
We can also remove the added books from the reading list.
The application uses Angular for front-end experience, NGRX for creating store that
maintains the data which is shared across multiple components, and NestJs for building
scalable Node.js server-side application.

---

#### CODE SMELLS AND IMPROVEMENTS:

    1. File - book-search.component.html
            The template contains a date function to change the format of the date.

        ```
            <strong>Published:</strong> {{ formatDate(b.publishedDate) }}
        ```

            Instead of using a function, we can use an angular date pipe to change the format.
            Pipes are useful because you can use them throughout your application, while
            only declaring each pipe once.

        ```
            <strong>Published:</strong> {{ b.publishedDate | date: 'dd/MM/yyyy' }}
        ```


    2. Do name end-to-end test specification files after the feature they test, with
       a suffix of .e2e-spec.

        Because it provides a consistent way to quickly identify end-to-end tests and provides
        pattern matching for test runners and build automation.

        ```
                 File: reading-list.spec.ts & search-books.specs.ts
                 should be with e2e-spec suffix.
                 eg: reading-list.e2e-spec.ts & search-books.e2e-spec.ts
        ```


    3. File: book-search.component.ts
        To prevent memory leak we can use async pipe instead of subscription, for retreiving books.

        ```
                books$ = this.store.select(getAllBooks);
                Use Observable like shown above, and remove empty ngOnInit().
        ```
        book-search.component.html

        ```
                *ngFor="let book of books$ | async"
        ```
        Using of `subscribe()` introduces complementary need to unsubscribe at the end of
        the component life-cycle to avoid memory leaks. We have to unsubscribe it manually.
        Angular handles subscriptions of `| async` pipes for us automatically so there is no
        need to unsubscribe manually in the component using ngOnDestroy.


    4. File: total-count.component.ts

        ```
                ngOnInit(): void {}
        ```
        We should not import Angular lifecycle hooks without it's utilization.
        It is a good practice to keep the code size in mind.


    5. File: book-serch.component.html
        The search button should be disabled if the search field is empty.
        We can add form validation for book search field.

        ```
                [disabled] = "!searchForm.valid"
        ```

         file: book-search.component.ts

        ```
                  searchForm = this.fb.group({
                  term: new FormControl(null, [Validators.required])
        ```


    6. Incorrect description for reading list reducer test case and book search
        component test case.
        We should always provide a meaningful and correct test case descriptions.

        -> File: reading-list.reducer.spec.ts

        ```
                describe('Books Reducer', () => {}
                describe('valid Books actions', () => {}
        ```

            As the test cases are for reading list the description should be related to
            reading list.

        ```

                describe('Reading List Reducer', () => {}
                describe('valid Reading List actions', () => {}
        ```

        -> File: book-search.component.spec.ts

        ```
                describe('ProductListComponent', () => {}
        ```

            As the test case is related to book search component the description should be
            BookSearchComponent.

        ```
                describe('BookSearchComponent', () => {}
        ```

        -> File: books.effects.spec.ts

        ```
            describe('loadBooks$', () => {}
        ```

            As the test cases are related to searchBooks$ effect, the description shoud be
            related to searchBooks$.

        ```
            describe('searchBooks$', () => {}
        ```

        -> Updated all the test cases.


    7. File: reading-list.reducer.ts

        `addToReadingList` & `removeFromReadingList`, both are responsible for calling APIs
        to add and remove book to and from the reading list respectively and also updates the state
        without checking the success and failure of the APIs.
        Therefore, both should be changed to `confirmedAddToReadingList` and `confirmedRemoveFromReadingList`.

        Fixed the test cases for reading-list.reducer.ts


    8. File: book-search.component.html

        Author name, Publisher name, Published Date, and Descriptions are displayed empty for some books
        in the book search list.

        ```
        For example : Compliance Test Reports - KWIC Index --> Author's and Publisher's name are missing.
                      Software Testing --> Description is missing.
                      test2 --> Date is missing.
        ```

        For better user experience, we should always provide an alternate message if the information is
        not available or mentioned.
        Fixed this issue by adding alternate message as below:

        ```
                {{ book.publisher || 'Publisher name not avaliable' }}
                {{ book.authors?.join(',') || 'Author name not avaliable' }}
                {{ book.description || 'Description not avaliable' }}
                {{ book.publishedDate | date: 'dd/MM/yyyy' ||  'Date not avaliable'}}
        ```

        Fixed the same issue in file: reading-list.component.html

        ```
                {{ item.authors?.join(',') || 'Author name not avaliable' }}
        ```


    9. File: book-search.component.html
        Search results are displayed based on the criteria - whether `searchTerm` is present or not.
        When we clear the `searchTerm` in input field, the result array remains present in the state. Hence, when we type any letter in input field the previous result array will be displayed again.

        Fixed by adding - check on the result array length in `book-search.component.html`.

        ```
                <ng-container *ngIf="(books$ | async).length; else empty">
        ```


    10. Added clear button to clear out the searchTerm at once and also call clearSearch action.
        File: book-search.component.html

        ```
                <button mat-icon-button matSuffix aria-label="reset book search"
                    data-testing="clear-button"
                    (click)="resetSearch()"
                >
                    <mat-icon>clear</mat-icon>
                </button>
        ```
            It will call resetSearch() function which will clear out the searchTerm from search
            bar and call clearSearch action.


    11. When we add a book to the reading list, the state is not updated with property ```isAdded``` as TRUE.
        So, in order to make the property ```isAdded``` as TRUE, we can pass it in the confirmedAddToReadingList action
        when it is dispatched.
        This is handled in the addBook$ effects.

        And add one more value in the book interface.
        File: index.ts (shared/models/src)

        ```
            export interface Book {
                ..
                ..
                isAdded?: boolean
            }
        ```
        Now, whenever we add a book to the reading list, the isAdded property will also get updated
        to TRUE in the state.


    12. File: book-search.component.ts
        We can exclude the method ```get searchTerm()``` because the search term value can be directly
        accessed by ```this.searchForm.value.term```.
        There is no need for a separate method.


    13. We should always add return types to function.
        eg: addBookToReadingList() and removeFromReadingList() function should have a return type.


    14. File: reading-list.component.html
        The current implementation of ```join(,)``` was doing nothing since it is not adding any space
        after ```comma (,)```.
        Fixed the same by:
        ``` join(, ) ```


    15. File: book-search.component.html
        User is unaware when there is any failure while searching the books, for that we should always
        provide an error with a valid message. In this way the user will know if in case there is some
        failure due to any reason.
        Added error message section in the file.


    16. The class name should be more clear and simple. It is better to use kebab-case for naming classes.
        Renamed few classes and updated stylings.
        e.g. In place of using <strong> tag everywhere, used new class ```font-weight: bold``` and defined 
        it under base.scss file.


    17. The website is not responsive for mobile devices. It should be compatible for all types of devices.


    18. When clearSearch() action is called, the properties such as searchTerm, loaded, and error were not resetting.
        Ideally when this action is called we should make:
        -> searchTerm: '',
        -> loaded: false,
        -> error: null
        Fixed above by making changes in the reducer function for clearSearch().

---

#### SUGGESTIONS

    1. Sign-in and Sign-up functionality can be added so that the user can have their account
       and can maintain the reading list.

    2. We can have a loading spinner, whenever the user is searching for a book we can show the
       spinner until the api returns the book list.

    3. We can have a clear button in the search field for a better user experience.
       --> Added a clear button.

    4. We can have different categories in the reading list or we can have a filter that filters
       out the list according to the user's choice.

    5. Application can be made responsive.

    6. We can have a placeholder(input-label) which shifts up once user enters a keyword on the book search
       field. Currently, the placeholder for the input-field disappears as soon as the user starts typing.
       --> Removed ``floatLabel="never"`` for the same.

---

#### ACCESSIBILITY

    ###### Lighthouse accessibility checks:

            1. Some buttons were missing ARIA-LABEL for accessible names. --> Fixed.

            2. Contrast Background and foreground colors were not having a sufficient contrast
               ratio. --> Fixed.

            3. Focus styles are essential for people using keyboards and keyboard emulators
               therefore, changed styling of button elements for better keyboard navigation.


    ###### Manual accessibility checks:

            1. Reading List button on the navbar was fixed with different styling for a better
               experience, as it was difficult to check whether it was focusable or not.

            2. Change in the styling of 'Want to Read' button on hover and also changed the search
               example text color for better visibility.

            3. The anchor tag "JavaScript" was not accessible from the keyboard.
               Fixed it by making it a button, added some styling, and made it keyboard focusable.

            4. Added alt-text for book-covers image. Gave it as 'book cover' instead of the book title because
               in some cases the book title was very long, so it was breaking the styling for the book grid.

            5. The page has logical tab-order.

            6. Interactive controls are keyboard focusable.

            7. Interactive elements indicate their purpose and state.

---
