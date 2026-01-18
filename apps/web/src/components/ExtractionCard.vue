<script setup lang="ts"></script>

<template>
  <div id="extractions" class="card bg-base-100">
    <div class="card-body">
      <h2 class="card-title mb-4">Extractions</h2>
      <div>
        <table class="table-sm table">
          <thead>
            <tr>
              <th>Coffee</th>
              <th>Brewer</th>
              <th>Grinder/Clicks</th>
              <th>Dose</th>
              <th>Yield</th>
              <th>Time</th>
              <th>Rating</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Ethiopia Gedeb</td>
              <td>V60</td>
              <td>Baratza Sette 270 / 20 clicks</td>
              <td>20g</td>
              <td>40g</td>
              <td>30s</td>
              <td><span class="badge badge-accent">8/10</span></td>
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
                    <li><a>View</a></li>
                    <li><a>Edit</a></li>
                    <li><a class="text-error">Delete</a></li>
                  </ul>
                </div>
              </td>
            </tr>
            <tr>
              <td>House Blend</td>
              <td>V60</td>
              <td>Baratza Sette 270 / 22 clicks</td>
              <td>22g</td>
              <td>44g</td>
              <td>35s</td>
              <td><span class="badge badge-accent">7/10</span></td>
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
                    <li><a>View</a></li>
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
        <p>2 extractions logged</p>
      </div>
    </div>
  </div>
</template>
