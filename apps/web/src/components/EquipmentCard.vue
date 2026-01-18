<script setup lang="ts"></script>

<template>
  <div id="equipment" class="card bg-base-100">
    <div class="card-body">
      <div class="mb-4 flex items-center justify-between">
        <h2 class="card-title">Equipment</h2>
        <button class="btn btn-sm">
          <span>+ Add Equipment</span>
        </button>
      </div>
      <div>
        <table class="table-sm table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Baratza Sette 270</td>
              <td><span class="badge badge-primary">GRINDER</span></td>
              <td>
                <div class="dropdown dropdown-end dropdown-bottom">
                  <div
                    tabindex="0"
                    role="button"
                    class="btn btn-xs btn-ghost m-1"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                      />
                    </svg>
                  </div>
                  <ul
                    tabindex="0"
                    class="dropdown-content menu bg-base-100 rounded-box z-50 w-32 p-2 shadow"
                  >
                    <li><a>Edit</a></li>
                    <li><a class="text-error">Delete</a></li>
                  </ul>
                </div>
              </td>
            </tr>
            <tr>
              <td>V60</td>
              <td><span class="badge badge-secondary">BREWER</span></td>
              <td>
                <div class="dropdown dropdown-end dropdown-bottom">
                  <div
                    tabindex="0"
                    role="button"
                    class="btn btn-xs btn-ghost m-1"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                      />
                    </svg>
                  </div>
                  <ul
                    tabindex="0"
                    class="dropdown-content menu bg-base-100 rounded-box z-50 w-32 p-2 shadow"
                  >
                    <li><a>Edit</a></li>
                    <li><a class="text-error">Delete</a></li>
                  </ul>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="text-base-content/50 py-8 text-center">
        <p>2 equipment items</p>
      </div>
    </div>
  </div>
</template>
