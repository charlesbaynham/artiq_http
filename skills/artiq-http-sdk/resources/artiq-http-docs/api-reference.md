# Reference
<details><summary><code>client.<a href="src/artiq_http_client/client.py">root_api_get</a>() -> typing.Any</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```python
from artiq_http_client import ArtiqClient

client = ArtiqClient(
    base_url="https://yourhost.com/path/to/api",
)

client.root_api_get()

```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request_options:** `typing.Optional[RequestOptions]` — Request-specific configuration.

</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.<a href="src/artiq_http_client/client.py">get_schedule_api_schedule_get</a>() -> typing.Dict[str, ScheduleItem]</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```python
from artiq_http_client import ArtiqClient

client = ArtiqClient(
    base_url="https://yourhost.com/path/to/api",
)

client.get_schedule_api_schedule_get()

```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request_options:** `typing.Optional[RequestOptions]` — Request-specific configuration.

</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.<a href="src/artiq_http_client/client.py">submit_experiment_api_schedule_post</a>(...) -> typing.Any</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```python
from artiq_http_client import ArtiqClient

client = ArtiqClient(
    base_url="https://yourhost.com/path/to/api",
)

client.submit_experiment_api_schedule_post(
    file="file",
    class_name="class_name",
)

```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `ExpId`

</dd>
</dl>

<dl>
<dd>

**pipeline:** `typing.Optional[str]`

</dd>
</dl>

<dl>
<dd>

**priority:** `typing.Optional[int]`

</dd>
</dl>

<dl>
<dd>

**flush:** `typing.Optional[bool]`

</dd>
</dl>

<dl>
<dd>

**due_date:** `typing.Optional[float]`

</dd>
</dl>

<dl>
<dd>

**request_options:** `typing.Optional[RequestOptions]` — Request-specific configuration.

</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.<a href="src/artiq_http_client/client.py">get_devices_api_devices_get</a>() -> typing.Dict[str, typing.Any]</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Get the current device_db

Returns:
    dict: ARTIQ Device_DB
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```python
from artiq_http_client import ArtiqClient

client = ArtiqClient(
    base_url="https://yourhost.com/path/to/api",
)

client.get_devices_api_devices_get()

```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request_options:** `typing.Optional[RequestOptions]` — Request-specific configuration.

</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.<a href="src/artiq_http_client/client.py">get_datasets_api_datasets_get</a>() -> typing.Any</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Get all existing ARTIQ datasets

This method might return a large output

Returns:
    dict: All broadcasted ARTIQ datasets
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```python
from artiq_http_client import ArtiqClient

client = ArtiqClient(
    base_url="https://yourhost.com/path/to/api",
)

client.get_datasets_api_datasets_get()

```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request_options:** `typing.Optional[RequestOptions]` — Request-specific configuration.

</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.<a href="src/artiq_http_client/client.py">get_dataset_names_api_datasets_names_get</a>() -> typing.Any</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Get list of all dataset names (keys only)

Returns a lightweight list of dataset names without their values,
enabling efficient browsing and searching.

Returns:
    dict: {"names": ["dataset1", "dataset2", ...]}
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```python
from artiq_http_client import ArtiqClient

client = ArtiqClient(
    base_url="https://yourhost.com/path/to/api",
)

client.get_dataset_names_api_datasets_names_get()

```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request_options:** `typing.Optional[RequestOptions]` — Request-specific configuration.

</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.<a href="src/artiq_http_client/client.py">get_dataset_values_api_datasets_values_get</a>(...) -> typing.Any</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Get values for specific datasets

Args:
    names: Comma-separated list of dataset names to fetch

Returns:
    dict: Requested datasets with their values
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```python
from artiq_http_client import ArtiqClient

client = ArtiqClient(
    base_url="https://yourhost.com/path/to/api",
)

client.get_dataset_values_api_datasets_values_get(
    names="names",
)

```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**names:** `str`

</dd>
</dl>

<dl>
<dd>

**request_options:** `typing.Optional[RequestOptions]` — Request-specific configuration.

</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.<a href="src/artiq_http_client/client.py">get_health_api_health_get</a>() -> typing.Any</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Get backend health and ARTIQ connection status

Returns:
    dict: Health status including ARTIQ connection state
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```python
from artiq_http_client import ArtiqClient

client = ArtiqClient(
    base_url="https://yourhost.com/path/to/api",
)

client.get_health_api_health_get()

```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request_options:** `typing.Optional[RequestOptions]` — Request-specific configuration.

</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.<a href="src/artiq_http_client/client.py">cancel_experiment_api_cancel_post</a>(...) -> typing.Any</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Cancel a running experiment

Args:
    rid (int): RID of the experiment to cancel
    force (bool): If True, forcibly close the experiment instead of requesting closure
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```python
from artiq_http_client import ArtiqClient

client = ArtiqClient(
    base_url="https://yourhost.com/path/to/api",
)

client.cancel_experiment_api_cancel_post(
    rid=1,
)

```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**rid:** `int`

</dd>
</dl>

<dl>
<dd>

**force:** `typing.Optional[bool]`

</dd>
</dl>

<dl>
<dd>

**request_options:** `typing.Optional[RequestOptions]` — Request-specific configuration.

</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.<a href="src/artiq_http_client/client.py">get_explist_api_explist_get</a>() -> ExperimentList</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```python
from artiq_http_client import ArtiqClient

client = ArtiqClient(
    base_url="https://yourhost.com/path/to/api",
)

client.get_explist_api_explist_get()

```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request_options:** `typing.Optional[RequestOptions]` — Request-specific configuration.

</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.<a href="src/artiq_http_client/client.py">get_schedule_item_api_schedule_rid_get</a>(...) -> ScheduleItem</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```python
from artiq_http_client import ArtiqClient

client = ArtiqClient(
    base_url="https://yourhost.com/path/to/api",
)

client.get_schedule_item_api_schedule_rid_get(
    rid=1,
)

```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**rid:** `int`

</dd>
</dl>

<dl>
<dd>

**request_options:** `typing.Optional[RequestOptions]` — Request-specific configuration.

</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.<a href="src/artiq_http_client/client.py">search_explist_api_explist_search_get</a>(...) -> ExperimentList</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```python
from artiq_http_client import ArtiqClient

client = ArtiqClient(
    base_url="https://yourhost.com/path/to/api",
)

client.search_explist_api_explist_search_get()

```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**q:** `typing.Optional[str]`

</dd>
</dl>

<dl>
<dd>

**request_options:** `typing.Optional[RequestOptions]` — Request-specific configuration.

</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.<a href="src/artiq_http_client/client.py">get_explist_defaults_api_explist_file_class_name_defaults_get</a>(...) -> ExperimentDefaults</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```python
from artiq_http_client import ArtiqClient

client = ArtiqClient(
    base_url="https://yourhost.com/path/to/api",
)

client.get_explist_defaults_api_explist_file_class_name_defaults_get(
    file="file",
    class_name="class_name",
)

```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**file:** `str`

</dd>
</dl>

<dl>
<dd>

**class_name:** `str`

</dd>
</dl>

<dl>
<dd>

**request_options:** `typing.Optional[RequestOptions]` — Request-specific configuration.

</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.<a href="src/artiq_http_client/client.py">submit_and_wait_api_schedule_submit_and_wait_post</a>(...) -> SubmitAndWaitResult</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Submit an experiment and wait for it to complete.

Args:
    expid: Experiment ID specification
    pipeline: Pipeline name (default: "main")
    priority: Scheduling priority (default: 0)
    flush: Whether to flush the pipeline (default: False)
    due_date: Optional due date as Unix timestamp
    timeout: Max seconds to wait (default: 60, max: 300)

Returns:
    SubmitAndWaitResult with rid, status, and timed_out fields
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```python
from artiq_http_client import ArtiqClient

client = ArtiqClient(
    base_url="https://yourhost.com/path/to/api",
)

client.submit_and_wait_api_schedule_submit_and_wait_post(
    file="file",
    class_name="class_name",
)

```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `ExpId`

</dd>
</dl>

<dl>
<dd>

**pipeline:** `typing.Optional[str]`

</dd>
</dl>

<dl>
<dd>

**priority:** `typing.Optional[int]`

</dd>
</dl>

<dl>
<dd>

**flush:** `typing.Optional[bool]`

</dd>
</dl>

<dl>
<dd>

**due_date:** `typing.Optional[float]`

</dd>
</dl>

<dl>
<dd>

**timeout:** `typing.Optional[float]`

</dd>
</dl>

<dl>
<dd>

**request_options:** `typing.Optional[RequestOptions]` — Request-specific configuration.

</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>
